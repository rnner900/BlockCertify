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

    // map issuer address to Certifate to get own created Certifates
    mapping(address => Certifate[]) public issuerCertificates;
    // map participant to Certifate to get received Certifates
    mapping(address => Certifate[]) public participantCertificates;

    // map issuer address to Courses to get own created Courses
    mapping(address => Course[]) public issuerCourses;
    // map participant to Courses to get Courses where the user is a participant
    mapping(address => Course[]) public participantCourses;
    
    // map Course ID to participant address for issuer to get all participants of a course
    mapping(uint => address[]) public courseParticipants;

    uint public courseCount;
    address public contractAddress = msg.sender;

    function addCertificate (address _participant, string memory _title, uint _courseId, string memory _courseTitle) public {
        participantCertificates[_participant].push(
            Certifate(msg.sender, _participant, _title, _courseId, _courseTitle)
        );
        issuerCertificates[msg.sender].push(
            Certifate(msg.sender, _participant, _title, _courseId, _courseTitle)
        );
    }

    function getIssuerCertificateCount (address _user) public view returns (uint count){
        return issuerCertificates[_user].length;
    }
    
    function getParticipantCertificateCount (address _user) public view returns (uint count){
        return participantCertificates[_user].length;
    }

    function getIssuerCourseCount (address _user) public view returns (uint count){
        return issuerCourses[_user].length;
    }
    
    function getParticipantCourseCount(address _user) public view returns (uint count) {
        return participantCourses[_user].length;
    }

    function addCourse (string memory _title) public {
        issuerCourses[msg.sender].push(
            Course(courseCount, _title)
        );
        courseCount++;
    }

    function addParticipant(uint _courseId, address _participant) public {

        require(issuerCourses[msg.sender].length > 0, "No course found!");
        
        // check if course exists
        Course[] memory myCourses = issuerCourses[msg.sender];

        uint length = myCourses.length;
        bool exists = false;
        Course  memory course;
        for (uint i = 0; i < length; i++) {
            if (myCourses[i].id != _courseId) {
                continue;
            }
            exists = true;
            course = myCourses[i];
            break;
        }

        require(exists, "Course does not exist!");
        require(!participantExists(_courseId, _participant), "Participant already in course!");

        courseParticipants[_courseId].push(_participant);
        participantCourses[_participant].push(course);
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
        
        addParticipant(issuerCourses[msg.sender][0].id, participantA);
        addParticipant(issuerCourses[msg.sender][0].id, participantB);
        addParticipant(issuerCourses[msg.sender][1].id, participantB);

        //issueCertificates(0, "Web Engineer");

        // test adding of certificates
        address receiver = 0x53bde67D3614B1f85eD12B77adA1c0Ca4e86b840;
        addCertificate(receiver, "Web Engineer", issuerCourses[msg.sender][0].id, issuerCourses[msg.sender][0].title);
        addCertificate(receiver, "Power Engineer", issuerCourses[msg.sender][1].id, issuerCourses[msg.sender][1].title);
    }
}