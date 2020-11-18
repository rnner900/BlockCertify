var Certification = artifacts.require("./Certification.sol");

contract("Certification", function(accounts) {
  var certificationInstance;

  it("initializes with two certificates", function() {
    return Certification.deployed().then(function(instance) {
      return instance.certificateCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Certification.deployed().then(function(instance) {
        certificationInstance = instance;
        
      return certificationInstance
    })
  });
});