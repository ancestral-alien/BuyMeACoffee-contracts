// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

// Desplegado en GOERLI en 0x79A3dd45a870F0d8b80a7a596518fe65CC237370 
// Desplegado en GOERLI en 0x398053A7CD3c638992fdb73b742600cC4F4e02d0

contract BuyMeACoffee {

// Evento para emitir cuabdo se crea un Memo 
event NewMemo(
    address indexed from,
    uint256 timestamp,
    string name,
    string message
);

// Evento para emitir cuando se hace un update de la withdrawal address.
event NewWithdrawalAddress(
    address indexed from,
    address indexed newaddress,
    uint256 timestamp
);

   // Memo struct.
struct Memo{
    address from;
    uint256 timestamp;
    string name;
    string message;
}

// Lista de memos recibidos 
Memo[] memos;   

// Adress de quien despliega el contrato 
address payable owner;

//Address que puede ejecutar el retiro de fondos
address payable withdrawAddress;

// Logica de Despliegue 
constructor () {
    owner = payable(msg.sender);
    withdrawAddress = owner;
}

/**
 * @dev comprar un cafecito al dueño del contrato
 * @param _name nombre del comprador del cafecito
 * @param _message un mensaje de parte del comprador del cafecito
 */

function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0,"No puedes comprar cafecitos con 0 ETH");

    memos.push(Memo(
        msg.sender,
        block.timestamp,
        _name,
        _message
    ));

    // Emite el log del evento con un nuevo memo creado 
    emit NewMemo(
        msg.sender,
        block.timestamp,
        _name,
        _message
    );
}

/**
 * @dev update de withdrawal address
 */
function updateWithdrawAddress(address payable _newaddress) public {
    require(msg.sender == owner, "Solo el owner puede cambiar la address de retiro de fondos" );
    withdrawAddress = _newaddress;

    // Emite el log del evento de update de address
    emit NewWithdrawalAddress(
        msg.sender,
        _newaddress, 
        block.timestamp
        ); 
}

/**
 * @dev enviado el balance total almacenado en este contrato al owner
 */

function withdrawTips() public {
    //require(owner.send(address(this).balance));
    require (withdrawAddress.send(address(this).balance));

}

/**
 * @dev retorna todos los memos recibidos y almacenados en la blockchain
 */

function getMemos() public view returns(Memo[] memory){
    return memos;
}
}

