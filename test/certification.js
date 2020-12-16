var Certification = artifacts.require("./Certification.sol");

contract("Certification", function(accounts) {
  var certificationInstance;
  const mockAddress = '0xededB61b4efE88a65221109ddF44C85cdE0B89ee';
  const myAddress = accounts[0];

  describe("initializes with two courses", async function() {

    var instance;
    
    before(async function(){
      instance = await Certification.deployed();
    });

    it("total course count is 2", async function() {
      var courseCount = await instance.courseCount();
      assert.equal(courseCount, 2);
    });

    it("my address has 1 course", async function() {
      var courseCount = await instance.getIssuerCourseCount(myAddress);
      assert.equal(courseCount, 1);
    });

    it("mock address has 1 course", async function() {
      var courseCount = await instance.getIssuerCourseCount(mockAddress);
      assert.equal(courseCount, 1);
    });

    it("mock course has id: 0", async function() {
      const courseId = await instance.issuerCourses(mockAddress, 0);
      const course = await instance.courses(courseId);
      assert.equal(courseId, 0);
      assert.equal(course.id, 0);
    });

    it("mock course has correct fields", async function() {
      const courseId = await instance.issuerCourses(mockAddress, 0);
      const course = await instance.courses(courseId);

      assert.equal(course.title, "Web Engineering 1"); // test course title set correctly
      assert.equal(course.issuer, "0xededB61b4efE88a65221109ddF44C85cdE0B89ee"); // test course issuer set to mock
      assert.equal(course.certificated, false); // test course is not certificated by default
      assert.equal(course.participantCount, 0) // test course participantCount is 0 by default
    });
  });

  describe("adding participants to courses", async function() {
    var instance;
    const participantA = '0xB0f421D3E4C37C8169ab85Dc3af3Ac502C11b86B';
    const participantB = '0xB648187910219506627A83fAd432685eCd84759D';
    
    before(async function(){
      instance = await Certification.deployed();
    });
    
    it("adding participants fails for mock course, because i am not the owner", async function() {
      // these are the mocked course
      const courseId = await instance.issuerCourses(mockAddress, 0);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      try {
        // trying to add participants to a course this account does not own
        await instance.addCourseParticipants(courseId, participants);
      }
      catch(e) { }

      // check if participant count is still 0
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 0);
    });

    it("adding participants succeeds for my course", async function() {
      // get the course id o
      const courseId = await instance.issuerCourses(myAddress, 0);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      participants.push(participantB);
      await instance.addCourseParticipants(courseId, participants);
    });

    it("participant count increases to 2 after adding two participants to my course", async function() {
      // check if participant count increased to 2
      const courseId = await instance.issuerCourses(myAddress, 0);
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 2);
    });

    it("can't add participant twice to my course", async function() {
      // these are the courses participants will be added to
      const courseId = await instance.issuerCourses(myAddress, 0);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      participants.push(participantB);

      try {
        instance.addCourseParticipants(courseId, participants);
      }
      catch(e) { }

      // check if participantCount is still 2
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 2);
    });

    it("my course has participantA (at array index 0) and participantB (at array index 1)", async function() {
      const courseId = await instance.issuerCourses(myAddress, 0);
      const courseParticipantA = await instance.getCourseParticipantAt(courseId, 0);
      const courseParticipantB = await instance.getCourseParticipantAt(courseId, 1);
      assert.equal(courseParticipantA, participantA);
      assert.equal(courseParticipantB, participantB);
    });

    it("participantA has my course assigned", async function() {
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      const participantCourseId = await instance.participantCourses(participantA, 0);
      assert.equal(parseInt(myCourseId), parseInt(participantCourseId))
    });

    it("participantB has my course assigned", async function() {
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      const participantCourseId = await instance.participantCourses(participantB, 0);
      assert.equal(parseInt(myCourseId), parseInt(participantCourseId))
    });
  });

  describe("issue certificates for courseA", async function() {
    var instance;
    const participantA = '0xB0f421D3E4C37C8169ab85Dc3af3Ac502C11b86B';
    const participantB = '0xB648187910219506627A83fAd432685eCd84759D';
    var participants = [];
    participants.push(participantA);
    participants.push(participantB);
    
    before(async function(){
      instance = await Certification.deployed();
    });

    // test issuing fails for non course owners
    it("issuing fails for mock course, because I am not the owner", async function() {
      const mockCourseId = await instance.issuerCourses(mockAddress, 0);
      try {
        await instance.issueCertificates(mockCourseId, "Test", "01", participants);
      }
      catch(e) { }

      const mockCourse = await instance.courses(mockCourseId);
      assert.equal(mockCourse.certificated, false);

      // number of certificates that mock address issued should still be at 0
      const mockCertficateCount = await instance.getIssuerCertificateCount(mockAddress);
      assert.equal(mockCertficateCount, 0);
    });

    it("issuing succeeds for my course", async function() {
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      try {
        await instance.issueCertificates(myCourseId, "Test", "01", participants);
      }
      catch(e) { 
        console.log(e);
      }
    });

    // test course is set to certificated
    it("course is set to certificated", async function() {
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      const myCourse = await instance.courses(myCourseId);
      assert.equal(myCourse.certificated, true);
    });


    // test issuer certificate count increases
    it("my certificate count increased to 2, because the course has 2 participants", async function() {
      const certficateCount = await instance.getIssuerCertificateCount(myAddress);
      assert.equal(certficateCount, 2);
    });

    // test certificate fields
    it("test if certficate for partificipant A is correct", async function() {
      const myCertficate = await instance.issuerCertificates(myAddress, 0);
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      assert.equal(myCertficate.title, "Test");
      assert.equal(parseInt(myCertficate.courseId), parseInt(myCourseId));
      assert.equal(myCertficate.imageId, "01");
      assert.equal(myCertficate.issuer, myAddress);
      assert.equal(myCertficate.participant, participantA);
    });

    // test participant has certificate
    it("test if partificipant A has certificate", async function() {
      const participantCertficate = await instance.participantCertificates(participantA, 0);
      const myCourseId = await instance.issuerCourses(myAddress, 0);
      assert.equal(participantCertficate.title, "Test");
      assert.equal(parseInt(participantCertficate.courseId), parseInt(myCourseId));
      assert.equal(participantCertficate.imageId, "01");
      assert.equal(participantCertficate.issuer, myAddress);
      assert.equal(participantCertficate.participant, participantA);
    });
  });

  describe("removing participants from courses", async function() {
    var instance;
    const participantB = '0xB648187910219506627A83fAd432685eCd84759D';
    
    before(async function(){
      instance = await Certification.deployed();
    });
    
    it("removing participants fails for mock course, because i am not the owner", async function() {
      // these are the mocked course
      const courseId = await instance.issuerCourses(mockAddress, 0);

      // these participants will be added to the courses
      const participants = [];
      participants.push(participantB);
      try {
        // trying to add participants to a course this account does not own
        await instance.removeCourseParticipants(courseId, participants);
      }
      catch(e) { }

      // check if participant count is still 0
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 0);
    });

    it("removing participants succeeds for my course", async function() {
      // get the course id o
      const courseId = await instance.issuerCourses(myAddress, 0);

      // these participants will be added to the courses
      const participants = [];
      participants.push(participantB);

      await instance.removeCourseParticipants(courseId, participants);
    });

    it("participant count decreases to 1 after removing participant B from my course", async function() {
      // check if participant count increased to 2
      const courseId = await instance.issuerCourses(myAddress, 0);
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 1);
    });

    it("can't remove participant that does not exists", async function() {
      // these are the courses participants will be added to
      const courseId = await instance.issuerCourses(myAddress, 0);

      // these participants will be added to the courses
      const participants = [];
      participants.push(participantB);

      try {
        instance.removeCourseParticipants(courseId, participants);
      }
      catch(e) { }

      // check if participantCount is still 1
      const course = await instance.courses(courseId);
      assert.equal(course.participantCount, 1);
    });

    it("participantB does not have my course assigned", async function() {
      const courseCount = await instance.getParticipantCourseCount(participantB);
      assert.equal(parseInt(courseCount), 0)
    });
  });
});