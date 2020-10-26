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
      return certificationInstance.certificates(1);
    }).then(function(certificate) {
      assert.equal(certificate[0], 1, "contains the correct id");
      // assert.equal(certificate[1], 0x54fBbFfd4386D2bEcC5aeF55a2e91cad448a2471, "contains the correct publisher address");
      assert.equal(certificate[2], 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF, "contains the correct collector address");
      assert.equal(certificate[3], "Web Engineer", "contains the correct title");
      assert.equal(certificate[4], "Web Engineering 1", "contains the correct course");
      return certificationInstance.certificates(2);
    }).then(function(certificate) {
      assert.equal(certificate[0], 2, "contains the correct id");
      // assert.equal(certificate[1], 0x54fBbFfd4386D2bEcC5aeF55a2e91cad448a2471, "contains the correct publisher address");
      assert.equal(certificate[2], 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF, "contains the correct collector address");
      assert.equal(certificate[3], "Power Engineer", "contains the correct title");
      assert.equal(certificate[4], "Power Engineering 1", "contains the correct course");
    });
  });
});