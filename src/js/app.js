App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    certificationInstance: null,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: async function () {
        /* Web3:
         * web3.js is a javascript library that allows our client-side
         * application to talk to the blockchain. We configure web3 here.
         */
        if (typeof web3 === 'undefined') {
            // Metamask not installed
            redirectToLogin();
            return;
        }

        if (window.ethereum) {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        await ethereum.enable();

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Certification.json', function (certification) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Certification = TruffleContract(certification);
            // Connect provider to interact with contract
            App.contracts.Certification.setProvider(App.web3Provider);
            App.getAccount(function(account) {
                App.account = account;

                window.ethereum.on('accountsChanged', function (accounts) {
                    location.reload();
                });

                var evt = $.Event('onContractReady');
                $(window).trigger(evt);
            });
        });
    },

    getAccount: function (callback) {
        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (err) console.log(err);
            callback(account);
        });
    },

    getIssuerCourses: function (issuerAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                console.log(issuerAddress);
                var courseCount = await instance.getIssuerCourseCount(issuerAddress);
                var courses = [];

                for (let i = 0; i < courseCount; i++) {
                    var course = await instance.issuerCourse(issuerAddress, i);
                    console.log(course);
                    courses.push(course);
                }

                return courses;
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    getIssuerCertificates: function (issuerAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                console.log(issuerAddress);
                var certificateCount = await instance.getIssuerCertificateCount(issuerAddress);
                var certificates = [];

                for (let i = 0; i < certificateCount; i++) {
                    var certificate = await instance.issuerCertificates(issuerAddress, i);
                    certificates.push(certificate);
                }

                return certificates;
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    getIssuerCourseById: function(issuer, courseId) {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                console.log(issuer);
                console.log(courseId);
                return instance.getIssuerCourseById(issuer, courseId);
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    getCourseCount: function () {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.courseCount();
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    addCourse: async function (title) {

        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCourse(title);
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    addCertificate: function () {
        var collector = $('#inputAddress').val();
        var title = $('#inputTitle').val();
        var course = $('#inputCourse').val();
        $(':input', '#addCertificateForm').val('');
        App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCertificate(collector, title, 7, course);
            })
            .then(function (result) {
                // Render the new balance and all contracts
                App.render();
                alert('Success:\nCertificate ' + title + ' of Course ' + course + ' has been given to ' + collector);
            })
            .catch(function (err) {
                console.error(err);
            });
    },

    updateBalance: function () {
        return web3.fromWei(
            web3.eth.getBalance(App.account, function (err, balance) {
                if (err) console.log(err);
                else {
                    $('#accountBalance').html('Your Balance: ' + web3.fromWei(balance, 'ether') + ' ETH');
                    App.balance = balance;
                }
            })
        );
    },

    newCourse: function () {
        var course = $('#courseName').val();
        $('#courseName').val('');
        App.contracts.Certification.deployed()
            .then(function (instance) {
                console.log(course);
                return instance.addCourse(course);
            })
            .then(function (result) {
                // Render the new balance and all contracts
                App.render();
                alert('Success:\nCourse ' + course + ' was successfully created.');
            })
            .catch(function (err) {
                console.error(err);
            });
    },

    redirectToLogin() {
        // window.location.href = "./login.html";
    }
};

window.addEventListener('load', function () {
    App.init();
});
