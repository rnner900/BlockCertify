pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract Certification {

    struct Certifate {
        address publisher;
        address participant;
        string title;
        uint courseId;
        string course;
    }

    struct Course {
        uint id;
        string title;
    }

    mapping(address => Certifate[]) public certificates;
    mapping(address => Course[]) public courses;
    mapping(uint => address[]) public courseParticipants;

    uint public courseCount;
    address public contractAddress = msg.sender;

    function addCertificate (address _collector, string memory _title, uint _courseId, string memory _courseTitle) public {
        certificates[_collector].push(
            Certifate(msg.sender, _collector, _title, _courseId, _courseTitle)
        );
    }

    // function issueCertificates (uint _courseId, string memory _title) public {
    //     certificateCount++;
    //     certificates[] = Certifate(certificateCount, _courseId, msg.sender, _title);
    // }

    function addCourse (string memory _title) public {
        courses[msg.sender].push(
            Course(courseCount, _title)
        );
        courseCount++;
    }

    function getCertificateCount (address _user) public view returns (uint count){
        return certificates[_user].length;
    }

    function addParticipant(uint _courseId, address _participant) public {

        require(courses[msg.sender].length > 0, "No course found!");
        
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

        require(exists, "Course does not exist!");
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
        return false;
    }

    function getCourseParticipants(uint _courseId) public view returns (address[] memory){
        return courseParticipants[_courseId];
    }


    constructor() public {
        addCourse("Web Engineering 1"); // course id: 0
        addCourse("Power Engineering 1"); // course id: 1

        address participantA = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;
        address participantB = 0xfC9a8E621F0D8821A770a5Cee4cEF8a90D387e8D;
        
        addParticipant(courses[msg.sender][0].id, participantA);
        addParticipant(courses[msg.sender][0].id, participantB);
        addParticipant(courses[msg.sender][1].id, participantB);

        //issueCertificates(0, "Web Engineer");

        // test adding of certificates
        address receiver = 0x53bde67D3614B1f85eD12B77adA1c0Ca4e86b840;
        addCertificate(receiver, "Web Engineer", courses[msg.sender][0].id, courses[msg.sender][0].title);
        addCertificate(receiver, "Power Engineer", courses[msg.sender][1].id, courses[msg.sender][1].title);
    }
}