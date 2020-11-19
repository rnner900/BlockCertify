App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    certificationInstance: null,

    init: function () {
        return App.initWeb3();
    },

    redirectToLogin() {
        return;
    },

    initWeb3: async function () {
        /* Web3:
         * web3.js is a javascript library that allows our client-side
         * application to talk to the blockchain. We configure web3 here.
         */

        if (typeof web3 === 'undefined') {
            // Metamask not installed
            App.redirectToLogin();
            return;
        }

        web3.eth.handleRevert = true;
        
        web3.eth.getAccounts(function (err, accounts) {
            if (err != null) console.error('An error occurred: ' + err);
            else if (accounts.length == 0) App.redirectToLogin();
            else console.log('User is logged in to MetaMask');
        });

        if (window.ethereum) {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        // check if user is logged in to Metamask
        

        await ethereum.enable();

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Certification.json', function (certification) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Certification = TruffleContract(certification);
            // Connect provider to interact with contract
            App.contracts.Certification.setProvider(App.web3Provider);
            App.getAccount(function (account) {
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
                    var course = await instance.issuerCourses(issuerAddress, i);
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
                console.log(certificateCount);
                var certificate = await instance.issuerCertificates(issuerAddress, 3);
                console.log(certificate);

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

    getIssuerCourse: function (issuerAddress, courseId) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var courseCount = await instance.getIssuerCourseCount(issuerAddress);
                for (let i = 0; i < courseCount; i++) {
                    var course = await instance.issuerCourses(issuerAddress, i);
                    console.log(course);
                    if (courseId == course[0]) {
                        return course;
                    }
                }
                throw "Course does not exist";
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    getCourseParticipants: function(courseId) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var participants = [];
                console.log(courseId);
                var participantCount = await instance.getCourseParticipantCount(courseId);
                console.log(parseInt(participantCount));
                for (let i = 0; i < participantCount; i++) {
                    var participant = await instance.courseParticipants(courseId, i);
                    console.log(participant);
                    participants.push(participant);
                }
                return participants;
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

    addParticipant: async function(courseId, participant) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                participant = await instance.addParticipant(courseId, participant, {from: App.account});
                console.log(participant);
                return participant;
            })
            .catch(function (error) {
                console.warn(error);
                App.redirectToLogin();
            });
    },

    addCourse: async function (title) {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCourse(title, {from: App.account});
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
                return instance.addCertificate(collector, title, 7, course, {from: App.account});
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

    isCourseCertificated: function (courseId) {
        return App.contracts.Certification.deployed()
        .then(async function (instance) {
            return instance.courseCertificated(courseId);
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
                return instance.addCourse(course, {from: App.account});
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


    
};

window.addEventListener('load', function () {
    App.init();
});
