// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageManager {
    uint public messageCount = 0;

    struct Message {
        uint id;
        string text;
    }

    mapping(uint => Message) public messages;

    // Create
    function addMessage(string memory _text) public {
        messageCount++;
        messages[messageCount] = Message(messageCount, _text);
    }

    // Read
    function getMessage(uint _id) public view returns (Message memory) {
        require(_id > 0 && _id <= messageCount, "Invalid message ID");
        return messages[_id];
    }

    // Update
    function updateMessage(uint _id, string memory _newText) public {
        require(_id > 0 && _id <= messageCount, "Invalid message ID");
        messages[_id].text = _newText;
    }

    // Delete
    function deleteMessage(uint _id) public {
        require(_id > 0 && _id <= messageCount, "Invalid message ID");
        delete messages[_id];
    }

    // Get all (IDs only — you can call getMessage for each)
    function getAllIds() public view returns (uint[] memory) {
        uint[] memory ids = new uint[](messageCount);
        uint counter = 0;
        for (uint i = 1; i <= messageCount; i++) {
            if (bytes(messages[i].text).length > 0) {
                ids[counter] = i;
                counter++;
            }
        }

        // Resize array
        uint[] memory trimmed = new uint[](counter);
        for (uint j = 0; j < counter; j++) {
            trimmed[j] = ids[j];
        }
        return trimmed;
    }
}
