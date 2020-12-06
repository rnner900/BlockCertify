App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    certificationInstance: null,

    init: function () {
        return App.initWeb3();
    },

    redirectToLogin() {
        window.location.href = './index.html';
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
        web3.eth.getCoinbase(async function (err, account) {
            if (err) console.log(err);

            $('#account-address').text("Addr.: " + account);

                web3.eth.getBalance(account, function (err, balance) {
                    if (err) console.log(err);
                    else {
                        $('#account-balance').text("Bal.: " + web3.utils.fromWei(balance, 'ether') + ' ETH');
                    }
                });

            callback(account);
        });

        
    },

    getIssuerCourses: function (issuerAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var courseCount = await instance.getIssuerCourseCount(issuerAddress);
                var courses = [];

                for (let i = 0; i < courseCount; i++) {
                    var courseId = await instance.issuerCourses(issuerAddress, i);
                    var course = await instance.courses(courseId);
                    courses.push(course);
                }

                return courses;
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getParticipantCourses: function (participantAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var courseCount = await instance.getParticipantCourseCount(participantAddress);
                var courses = [];

                for (let i = 0; i < courseCount; i++) {
                    var courseId = await instance.participantCourses(participantAddress, i);
                    var course = await instance.courses(courseId);
                    courses.push(course);
                }

                return courses;
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getIssuerCertificates: function (issuerAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
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
            });
    },

    getIssuerCertificateAt: function (issuerAddress, index) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                return instance.issuerCertificates(issuerAddress, index);
            })
            .catch(function (error) {
                console.warn(error);
            });
    },
    
    getParticipantCertificates: function (participantAddress) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var certificateCount = await instance.getParticipantCertificateCount(participantAddress);
                var certificates = [];

                for (let i = 0; i < certificateCount; i++) {
                    var certificate = await instance.participantCertificates(participantAddress, i);
                    certificates.push(certificate);
                }

                return certificates;
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getParticipantCertificateAt : function (participantAddress, index) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                return instance.participantCertificates(participantAddress, index);
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getCourse: function (courseId) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                return await instance.courses(courseId);
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getCourseParticipants: function (courseId) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                var participants = [];
                var course = await instance.courses(courseId);
                var participantCount = course[4];
                for (var i = 0; i < participantCount; i++) {
                    var participant = await instance.getCourseParticipantAt(courseId, i);
                    participants.push(participant);
                }
                return participants;
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    getCourseCount: function () {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.courseCount();
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    addCourseParticipants: async function (courseId, participants) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                return instance.addCourseParticipants(courseId, participants, { from: App.account });
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    removeCourseParticipants: async function (courseId, participants) {
        return App.contracts.Certification.deployed()
            .then(async function (instance) {
                return instance.removeCourseParticipants(courseId, participants, { from: App.account });
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    addCourse: async function (title) {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCourse(title, { from: App.account });
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    issueCertificates: async function (courseId, title, imageId, issueParticipants) {
        return App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.issueCertificates(courseId, title, imageId, issueParticipants, { from: App.account });
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    addCertificate: function () {
        var collector = $('#inputAddress').val();
        var title = $('#inputTitle').val();
        var course = $('#inputCourse').val();
        $(':input', '#addCertificateForm').val('');
        App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCertificate(collector, title, 7, course, { from: App.account });
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

    updateAccountAddress: function () {
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

    updateAccountBalance: function () {
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
                return instance.addCourse(course, { from: App.account });
            })
            .then(function (result) {
                // Render the new balance and all contracts
                App.render();
                alert('Success:\nCourse ' + course + ' was successfully created.');
            })
            .catch(function (err) {
                console.error(err);
            });
    }
};

window.addEventListener('load', function () {
    App.init();
    $('#search-input-value').focus(function () {
        $(this).attr('data-default', $(this).width());
        $(this).animate({width: 320});
    }).blur(function () {
        var w = $(this).attr('data-default');
        $(this).animate({ width: w }, 'slow');
    });
});
