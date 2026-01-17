// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IncidentSandbox {
    address public owner;
    address public controller;

    // 演示与事故响应用的当前池子状态
    bool public paused;
    uint256 public reserve;
    int256 public price;
    uint256 public withdrawLimitBps;

    event ReserveChanged(uint256 oldReserve, uint256 newReserve, address by);
    event PriceUpdated(int256 oldPrice, int256 newPrice, address by);
    event LargeOutflow(uint256 amount, address by);
    event PausedSet(bool paused);
    event WithdrawLimitSet(uint256 bps);
    event ControllerUpdated(address controller);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyController() {
        require(msg.sender == controller, "NOT_CONTROLLER");
        _;
    }

    constructor(uint256 initialReserve, int256 initialPrice) {
        owner = msg.sender;
        reserve = initialReserve;
        price = initialPrice;
        // 默认不限制提取
        withdrawLimitBps = 10000;
    }

    function setController(address newController) external onlyOwner {
        controller = newController;
        emit ControllerUpdated(newController);
    }

    function trade(uint256 amount) external {
        require(!paused, "PAUSED");
        // 演示用的简单价格/储备更新
        reserve += amount;
        int256 oldPrice = price;
        price = price + int256(amount / 10);
        emit ReserveChanged(reserve - amount, reserve, msg.sender);
        emit PriceUpdated(oldPrice, price, msg.sender);
    }

    function drain(uint256 amount) external {
        require(!paused, "PAUSED");
        _checkWithdrawLimit(amount);
        // 模拟大额流出事件
        uint256 oldReserve = reserve;
        if (amount >= reserve) {
            reserve = 0;
        } else {
            reserve -= amount;
        }
        emit LargeOutflow(amount, msg.sender);
        emit ReserveChanged(oldReserve, reserve, msg.sender);
    }

    function setPriceShock(int256 shock) external {
        // 施加一次价格冲击
        int256 oldPrice = price;
        price = price + shock;
        emit PriceUpdated(oldPrice, price, msg.sender);
    }

    function setPaused(bool isPaused) external onlyController {
        paused = isPaused;
        emit PausedSet(isPaused);
    }

    function setWithdrawLimitBps(uint256 bps) external onlyController {
        require(bps <= 10000, "BPS_TOO_HIGH");
        withdrawLimitBps = bps;
        emit WithdrawLimitSet(bps);
    }

    function resetDemoState(
        uint256 newReserve,
        int256 newPrice,
        bool newPaused,
        uint256 newWithdrawLimitBps
    ) external onlyOwner {
        // 重置沙盒状态以便重复演示/测试
        require(newWithdrawLimitBps <= 10000, "BPS_TOO_HIGH");
        uint256 oldReserve = reserve;
        int256 oldPrice = price;
        reserve = newReserve;
        price = newPrice;
        paused = newPaused;
        withdrawLimitBps = newWithdrawLimitBps;
        emit ReserveChanged(oldReserve, newReserve, msg.sender);
        emit PriceUpdated(oldPrice, newPrice, msg.sender);
        emit PausedSet(newPaused);
        emit WithdrawLimitSet(newWithdrawLimitBps);
    }

    function _checkWithdrawLimit(uint256 amount) internal view {
        if (withdrawLimitBps >= 10000) {
            return;
        }
        // 按比例限制可提取上限
        uint256 maxOut = (reserve * withdrawLimitBps) / 10000;
        require(amount <= maxOut, "WITHDRAW_LIMIT");
    }
}
