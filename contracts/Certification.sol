pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract Certification {

    struct Certifate {
        address publisher;
        address participant;
        string title;
        uint courseId;
        string course;
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

    // map issuer address to Certifate to get own created Certifates
    mapping(address => Certifate[]) public issuerCertificates;
    // map participant to Certifate to get received Certifates
    mapping(address => Certifate[]) public participantCertificates;

    // map issuer address to Courses to get own created Courses
    mapping(address => uint[]) public issuerCourses;
    // map participant to Courses to get Courses where the user is a participant
    mapping(address => uint[]) public participantCourses;

    mapping(uint => Course) public courses;

    uint public courseCount;
    address public contractAddress = msg.sender;

    function addCourseCertificates(string memory _title, uint _courseId, string memory _courseTitle, string memory _imageId) public {
        address[] memory participants = courses[_courseId].participants;
    
        for (uint i = 0; i < participants.length; i++) {
            address participant = participants[i];
            
            participantCertificates[participant].push(
                Certifate(msg.sender, participant, _title, _courseId, _courseTitle, _imageId)
            );

            issuerCertificates[msg.sender].push(
                Certifate(msg.sender, participant, _title, _courseId, _courseTitle, _imageId)
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

    function addCourse (string memory _title) public {
        courses[courseCount] = Course(courseCount, _title, msg.sender, false, 0, new address[](0));
        issuerCourses[msg.sender].push(courseCount);
        courseCount++;
    }

    function addParticipant(uint _courseId, address _participant) public {

        require(issuerCourses[msg.sender].length > 0, "No course found!");
        require(courses[_courseId].issuer == msg.sender, "You are not owner of this course!");
        require(!participantExists(_courseId, _participant), "Participant already in course!");

        courses[_courseId].participants.push(_participant);
        participantCourses[_participant].push(_courseId);
        courses[_courseId].participantCount++;
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


    constructor() public {
        addCourse("Web Engineering 1"); // course id: 0
        addCourse("Power Engineering 1"); // course id: 1

        address participantA = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;
        address participantB = 0xfC9a8E621F0D8821A770a5Cee4cEF8a90D387e8D;
        
        addParticipant(0, participantA);
        addParticipant(0, participantB);
        addParticipant(1, participantB);

        //issueCertificates(0, "Web Engineer");

        // test adding of certificates
        address receiver = 0x53bde67D3614B1f85eD12B77adA1c0Ca4e86b840;
    }
}