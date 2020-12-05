var Certification = artifacts.require("./Certification.sol");

contract("Certification", function(accounts) {
  var certificationInstance;
  var issuer = accounts[0];

  describe("initializes with two courses", async function() {

    var instance;
    
    before(async function(){
      instance = await Certification.deployed();
    });

    it("course count is 2", async function() {
      var courseCount = await instance.getIssuerCourseCount(issuer);
      assert.equal(courseCount, 2);
    });

    var courseA;
    it("courseA has id: 0", async function() {
      var courseIdA = await instance.issuerCourses(issuer, 0);
      courseA = await instance.courses(courseIdA);
      assert.equal(courseIdA, 0);
      assert.equal(courseA.id, 0);
    });

    var courseB;
    it("courseB has id: 1", async function() {
      var courseIdB = await instance.issuerCourses(issuer, 1);
      courseB = await instance.courses(courseIdB);
      assert.equal(courseIdB, 1); 
      assert.equal(courseB.id, 1);
    });

    it("courseA has correct fields", async function() {
      assert.equal(courseA.title, "Web Engineering 1"); // test course title set correctly
      assert.equal(courseA.issuer, "0xededB61b4efE88a65221109ddF44C85cdE0B89ee"); // test course issuer set to mock
      assert.equal(courseA.certificated, false); // test course is not certificated by default
      assert.equal(courseA.participantCount, 0) // test course participantCount is 0 by default
    });

    it("courseB has correct fields", async function() {
      assert.equal(courseB.id, 1); // test course id set correctly
      assert.equal(courseB.title, "Power Engineering 1"); // test course title set correctly
      assert.equal(courseB.issuer, issuer); // test course issuer set correctly
      assert.equal(courseB.certificated, false); // test course is not certificated by default
      assert.equal(courseB.participantCount, 0) // test course participantCount is 0 by default
    });

  });

  describe("adding participants to courses", async function() {
    var instance;
    const participantA = '0xB0f421D3E4C37C8169ab85Dc3af3Ac502C11b86B';
    const participantB = '0xB648187910219506627A83fAd432685eCd84759D';
    
    before(async function(){
      instance = await Certification.deployed();
    });
    
    var courseIdA;
    it("adding participants fails for non course owners", async function() {
      // these are the courses participants will be added to
      courseIdA = await instance.issuerCourses(issuer, 0);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      try {
        await instance.addCourseParticipants(courseIdA, participants);
      }
      catch(e) { }

      // check if participant count is still 0
      const courseA = await instance.courses(courseIdA);
      assert.equal(courseA.participantCount, 0);
    });

    var courseIdB;
    it("partipicipant count of courseB increased by 2 after adding participantA & participantB", async function() {
      // these are the courses participants will be added to
      courseIdB = await instance.issuerCourses(issuer, 1);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      participants.push(participantB);
      await instance.addCourseParticipants(courseIdB, participants);

      // check if participant count increased to 2
      const courseB = await instance.courses(courseIdB);
      assert.equal(courseB.participantCount, 2);
    });

    it("can't add participant twice to same course", async function() {
      // these are the courses participants will be added to
      courseIdB = await instance.issuerCourses(issuer, 1);

      // these participants will be added to the courses
      const participants = [];

      // add participantA to courseA
      participants.push(participantA);
      participants.push(participantB);

      try {
        instance.addCourseParticipants(courseIdB, participants);
      }
      catch(e) { }

      // check if participantCount is still 2
      const courseB = await instance.courses(courseIdB);
      assert.equal(courseB.participantCount, 2);
    });

    it("courseB has participantA (at array index 0) and participantB (at array index 1)", async function() {
      const courseBParticipantA = await instance.getCourseParticipantAt(courseIdB, 0);
      const courseBParticipantB = await instance.getCourseParticipantAt(courseIdB, 1);
      assert.equal(courseBParticipantA, participantA);
      assert.equal(courseBParticipantB, participantB);
    });

    it("participantA has 1 course", async function() {
      const participantACourseCount = await instance.getParticipantCourseCount(participantA);
      assert.equal(participantACourseCount, 1);
    });

    it("participantA has courseB", async function() {
      const mCourseIdB = await instance.participantCourses(participantA, 0);
      assert.equal(courseIdB, mCourseIdB);
    });

    it("participantB has 1 course", async function() {
      const participantBCourseCount = await instance.getParticipantCourseCount(participantB);
      assert.equal(participantBCourseCount, 1);
    });

    it("participantB has courseA and courseB", async function() {
      const mCourseIdA = await instance.participantCourses(participantA, 0);
      const mCourseIdB = await instance.participantCourses(participantA, 1);
      assert.equal(courseIdA, mCourseIdA);
      assert.equal(courseIdB, mCourseIdB);
    });
  });

  describe("issue certificates for courseA", async function() {
    var instance;
    const courseIdA = 0;
    const courseIdB = 1;

    const participantA = '0xB0f421D3E4C37C8169ab85Dc3af3Ac502C11b86B';
    const participantB = '0xB648187910219506627A83fAd432685eCd84759D';
    
    before(async function(){
      instance = await Certification.deployed();
    });

    // test issuing fails for non course owners
    it("issuing fails for non course owners", async function() {
      // in the contract contructor issuer of course a index 0 is mocked
      // therefore this test address should fail to issue its certificates
      // because it is not owner of the course
      await instance.addCourseCertificates("Test", courseIdA, "01");
    });

    // test course is set to certificated
    it("course is set to certificated", async function() {
      // certificate title: 'Test', imageId: '01'
      await instance.addCourseCertificates("Test", courseIdA, "01");
      const courseA = await instance.courses[courseIdA];
      assert(courseA,)
    });

    // test certificate fields

    // test issuer has assigned certificates

    // test participant has certificate

  })
});