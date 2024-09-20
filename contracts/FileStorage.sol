// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        uint256 id;
        string ipfsHash;
        string fileName;
        string fileType;
        uint256 uploadTime;
        address uploader;
    }

    mapping(uint256 => File) public files;
    uint256 public fileCount;

    event FileUploaded(
        uint256 id,
        string ipfsHash,
        string fileName,
        string fileType,
        uint256 uploadTime,
        address uploader
    );

    function uploadFile(string memory _ipfsHash, string memory _fileName, string memory _fileType) public {
        fileCount++;
        files[fileCount] = File(fileCount, _ipfsHash, _fileName, _fileType, block.timestamp, msg.sender);
        emit FileUploaded(fileCount, _ipfsHash, _fileName, _fileType, block.timestamp, msg.sender);
    }

    function getFile(uint256 _fileId) public view returns (File memory) {
        return files[_fileId];
    }

    function getAllFiles() public view returns (File[] memory) {
        File[] memory fileList = new File[](fileCount);
        for (uint256 i = 1; i <= fileCount; i++) {
            fileList[i - 1] = files[i];
        }
        return fileList;
    }
}
