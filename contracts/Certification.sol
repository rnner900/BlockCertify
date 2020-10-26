pragma solidity 0.5.16;

contract Certification {

    struct Certifate {
        uint id;
        address publisher;
        address collector;
        string title;
        string course;
    }

    mapping(uint => Certifate) public certificates;

    uint public certificateCount;

    function addCertificate (address _collector, string memory _title, string memory _course) public {
        certificateCount++;
        certificates[certificateCount] = Certifate(certificateCount, msg.sender, _collector, _title, _course);
    }

    constructor() public {
        address collector = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;
        addCertificate(collector, "Web Engineer", "Web Engineering 1");
        addCertificate(collector, "Power Engineer", "Power Engineering 1");
    }
}