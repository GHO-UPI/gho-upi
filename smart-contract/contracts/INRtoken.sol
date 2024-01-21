pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract INRToken is ERC20 {
    address public admin;

    constructor() ERC20("INRToken", "INR") {
        admin = msg.sender;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == admin, "only admin");
        _mint(to, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }

    function deposit(uint amount) external {
        _transfer(msg.sender, address(this), amount);
    }

    function withdraw(uint amount) external {
        require(balanceOf(address(this)) >= amount, "Insufficient balance in contract");
        _transfer(address(this), msg.sender, amount);
    }
}
