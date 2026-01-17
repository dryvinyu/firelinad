// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIncidentSandbox {
    function setPaused(bool isPaused) external;
    function setWithdrawLimitBps(uint256 bps) external;
    function reserve() external view returns (uint256);
    function price() external view returns (int256);
    function paused() external view returns (bool);
    function withdrawLimitBps() external view returns (uint256);
}

contract EmergencyController {
    address public owner;
    address public sandbox;

    // 当前事故状态标记
    bool public emergencyMode;
    bool public oracleFrozen;
    bool public isolated;
    bytes32 public lastSnapshotId;

    event ActionAttempted(bytes32 actionId, string actionType, address actor);
    event ActionApplied(bytes32 actionId, string actionType);
    event SnapshotCreated(bytes32 snapshotId, bytes32 stateHash);
    event OracleFrozen();
    event Isolated(bool isolated);
    event EmergencyModeSet(bool enabled);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address sandboxAddress) {
        owner = msg.sender;
        sandbox = sandboxAddress;
    }

    function pausePool() external {
        _requireNoEmergency();
        // 进入紧急状态并暂停沙盒
        bytes32 actionId = _actionId("PAUSE");
        emit ActionAttempted(actionId, "pause", msg.sender);
        emergencyMode = true;
        emit EmergencyModeSet(true);
        IIncidentSandbox(sandbox).setPaused(true);
        emit ActionApplied(actionId, "pause");
    }

    function setWithdrawLimit(uint256 bps) external {
        _requireNoEmergency();
        // 进入紧急状态并设置提取限额
        bytes32 actionId = _actionId("LIMIT");
        emit ActionAttempted(actionId, "limit", msg.sender);
        emergencyMode = true;
        emit EmergencyModeSet(true);
        IIncidentSandbox(sandbox).setWithdrawLimitBps(bps);
        emit ActionApplied(actionId, "limit");
    }

    function freezeOracle() external {
        // 冻结沙盒中的预言机读数
        bytes32 actionId = _actionId("ORACLE");
        emit ActionAttempted(actionId, "freezeOracle", msg.sender);
        oracleFrozen = true;
        emit OracleFrozen();
        emit ActionApplied(actionId, "freezeOracle");
    }

    function isolate() external {
        // 标记系统与外部动作隔离
        bytes32 actionId = _actionId("ISOLATE");
        emit ActionAttempted(actionId, "isolate", msg.sender);
        isolated = true;
        emit Isolated(true);
        emit ActionApplied(actionId, "isolate");
    }

    function snapshot() external {
        // 记录关键状态哈希用于审计
        bytes32 snapshotId = _actionId("SNAPSHOT");
        bytes32 stateHash = keccak256(
            abi.encode(
                IIncidentSandbox(sandbox).reserve(),
                IIncidentSandbox(sandbox).price(),
                IIncidentSandbox(sandbox).paused(),
                IIncidentSandbox(sandbox).withdrawLimitBps(),
                emergencyMode,
                oracleFrozen,
                isolated
            )
        );
        lastSnapshotId = snapshotId;
        emit SnapshotCreated(snapshotId, stateHash);
    }

    function resetController() external onlyOwner {
        // 事件处理后清理紧急标记
        emergencyMode = false;
        oracleFrozen = false;
        isolated = false;
        emit EmergencyModeSet(false);
    }

    function _actionId(string memory actionType) internal view returns (bytes32) {
        // 用于审计的唯一动作 ID
        return keccak256(abi.encodePacked(actionType, block.number, msg.sender, address(this)));
    }

    function _requireNoEmergency() internal view {
        // 已处于紧急状态时禁止新动作
        require(!emergencyMode, "EMERGENCY_ACTIVE");
    }
}
