pragma solidity 0.5.16;

contract Certification {

    struct Certifate {
        uint courseId;
        address publisher;
        address participant;
        string title;
    }

    struct Course {
        uint id;
        string title;
    }

    mapping(address => Certifate) public certificates;
    mapping(address => Course[]) public courses;
    mapping(uint => address[]) public courseParticipants;

    uint public certificateCount;
    uint public courseCount;

    function issueCertificates (uint _courseId, string memory _title) public {
        certificateCount++;
        certificates[] = Certifate(certificateCount, _courseId, msg.sender, _title);
    }

    function addCourse (string memory _title) public {
        courseCount++;
        courses[msg.sender].push(
            Course(courseCount, _title)
        );
    }

    function addParticipant(uint _courseId, address _participant) public {

        require(courses[msg.sender].length == 0, "No course found!");
        
        // check if course exists
        Course[] memory myCourses = courses[msg.sender];
        uint length = myCourses.length;
        bool exists = false;

        for (uint i = 0; i < length; i++) {
            if (myCourses[i].id != _courseId) {
                continue;
            }
            exists = true;
            break;
        }

        require(!exists, "Course does not exist!");
        require(!participantExists(_courseId, _participant), "Participant already in course!");

        courseParticipants[_courseId].push(_participant);
    }

    function participantExists (uint _courseId, address _participant) private view returns (bool) {
        address[] memory participants = courseParticipants[_courseId];
        for (uint i; i < participants.length; i++) {
            if (participants[i]==_participant) {
                return true;
            }
        }
    }


    constructor() public {
        addCourse("Web Engineering 1"); // course id: 0
        addCourse("Power Engineering 1"); // course id: 1

        address participantA = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;
        address participantB = 0xfC9a8E621F0D8821A770a5Cee4cEF8a90D387e8D;
        
        addParticipant(0, participantA);
        addParticipant(1, participantB);

        issueCertificates(0, "Web Engineer");
    }
}