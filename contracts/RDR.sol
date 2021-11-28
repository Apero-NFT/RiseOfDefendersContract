// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RDR is ERC20, Ownable, ERC20Burnable, ERC20Pausable {
    using SafeMath for uint256;
    uint256 private _totalTokens = 5 * 10**8 * 10**uint256(decimals());

    constructor() ERC20("Golden West Token", "GWT") {
        _mint(owner(), _totalTokens);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getBurnedAmountTotal() external view returns (uint256 _amount) {
        return _totalTokens.sub(totalSupply());
    }
}
