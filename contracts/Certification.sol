pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract Certification {

    struct Certifate {
        address issuer;
        address participant;
        string title;
        uint courseId;
        string courseTitle;
        string imageId;
    }

    struct Course {
        uint id;
        string title;
        address issuer;
        bool certificated;

        uint participantCount;
        address[] participants;
    }


    mapping(address => Certifate[]) public issuerCertificates;      // map issuer to certificate
    mapping(address => Certifate[]) public participantCertificates; // map participant to certificate

    mapping(address => uint[]) public issuerCourses;                // map issuer to course
    mapping(address => uint[]) public participantCourses;           // map participant to course

    mapping(uint => Course) public courses;                         // map course id to course

    uint public courseCount;
    address public contractAddress = msg.sender;

    // issuer certificate for a course
    function issueCertificates(uint _courseId, string memory _title, string memory _imageId, address[] memory _issueParticipants) public {
        string memory courseTitle = courses[_courseId].title;

        require(courses[_courseId].issuer == msg.sender, "You are not owner of this course");

        for (uint i = 0; i < _issueParticipants.length; i++) {
            address participant = _issueParticipants[i];
            
            participantCertificates[participant].push(
                Certifate(msg.sender, participant, _title, _courseId, courseTitle, _imageId)
            );

            issuerCertificates[msg.sender].push(
                Certifate(msg.sender, participant, _title, _courseId, courseTitle, _imageId)
            );
        }

        courses[_courseId].certificated = true;
    }

    function getIssuerCertificateCount (address _user) public view returns (uint count){
        return issuerCertificates[_user].length;
    }
    
    function getParticipantCertificateCount (address _user) public view returns (uint count){
        return participantCertificates[_user].length;
    }

    function getIssuerCourseCount (address _issuer) public view returns (uint count){
        return issuerCourses[_issuer].length;
    }

    function getParticipantCourseCount(address _participant) public view returns (uint count) {
        return participantCourses[_participant].length;
    }

    function getCourseParticipantAt(uint _courseId, uint index) public view returns (address count){
        return courses[_courseId].participants[index];
    }

    // Adds / issues a course with a title. 
    // The course issuer will be set to the address that calls this methode
    function addCourse (string memory _title) public {
        courses[courseCount] = Course(courseCount, _title, msg.sender, false, 0, new address[](0));
        issuerCourses[msg.sender].push(courseCount);
        courseCount++;
    }

    function addCourseParticipants(uint _courseId, address[] memory _participants) public {

        require(issuerCourses[msg.sender].length > 0, "No course found!");
        require(courses[_courseId].issuer == msg.sender, "You are not owner of this course!");

        for (uint i = 0; i < _participants.length; i++) {
            // check if participant is already in course
            bool exists = participantExists(_courseId, _participants[i]);
            if (!exists) {
                address participant = _participants[i];
                courses[_courseId].participants.push(participant);
                participantCourses[participant].push(_courseId);
                courses[_courseId].participantCount++;
            }
        }
    }

    function removeCourseParticipants(uint _courseId, address[] memory _participants) public {

        require(issuerCourses[msg.sender].length > 0, "No course found!");
        require(courses[_courseId].issuer == msg.sender, "You are not owner of this course!");

        for (uint i = 0; i < _participants.length; i++) {
            // check if participant is already in course
            address participant = _participants[i];
            removeParticipantCourse(participant, _courseId);
            removeCourseParticipant(_courseId, participant);
        }
    }

    function removeParticipantCourse (address _participant, uint _courseId) private {
        uint[] memory _courses = participantCourses[_participant];

        // go through all participantCourses
        uint numberOfCourses = _courses.length;
        for (uint i; i < numberOfCourses; i++) {

            // check if participantCourse is the target one
            if (_courses[i] == _courseId) {
                // delete participantCourse by "swaping & delete"
                participantCourses[_participant][i] = _courses[numberOfCourses - 1];
                delete participantCourses[_participant][numberOfCourses - 1];
                participantCourses[_participant].length--;
                break;
            }
        }
    }

    function removeCourseParticipant (uint _courseId, address _participant) private {
        address[] memory _participants = courses[_courseId].participants;

        // go through all courseParticipants
        uint numberOfParticipants = _participants.length;
        for (uint i; i < numberOfParticipants; i++) {

            // check if courseParticipant is the target one
            if (_participants[i] == _participant) {
                // delete courseParticipant by "swaping & delete"
                courses[_courseId].participants[i] = _participants[numberOfParticipants - 1];
                delete courses[_courseId].participants[numberOfParticipants - 1];
                courses[_courseId].participants.length--;
                courses[_courseId].participantCount--;
                break;
            }
        }
    }

    function participantExists (uint _courseId, address _participant) private view returns (bool) {
        address[] memory participants = courses[_courseId].participants;
        for (uint i; i < participants.length; i++) {
            if (participants[i]==_participant) {
                return true;
            }
        }
        return false;
    }


    address[] participants;

    constructor() public {

        // manually add a mocking course with a mocked issuer address for testing the contract
        address mockIssuer = 0xededB61b4efE88a65221109ddF44C85cdE0B89ee;
        courses[courseCount] = Course(courseCount, "Web Engineering 1", mockIssuer, false, 0, new address[](0));
        issuerCourses[mockIssuer].push(courseCount);
        courseCount++;

        // add a course for testing
        addCourse("Power Engineering 1");
    }
}