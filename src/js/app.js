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

            return App.render();
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

    render: function () {
        var loader = $('#loader');
        var content = $('#content');

        // for testing purposes
        var contractAddress;

        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (err) console.log(err);
            else {
                App.account = account;
                $('#accountAddress').html('Your Account: ' + App.account);
                balance = App.updateBalance();
            }
        });

        // Load contract data
        App.contracts.Certification.deployed()
            .then(function (instance) {
                App.certificationInstance = instance;
                return App.certificationInstance.contractAddress();
            })
            .then(function (_contractAddress) {
                var certificatesResults = $('#certificatesResults');
                certificatesResults.empty();
                contractAddress = _contractAddress;
                // console.log('contractAdress: ' + contractAddress);
                App.certificationInstance.getCertificateCount(App.account).then(function (certificateCount) {
                    for (let i = 0; i < certificateCount; i++) {
                        App.certificationInstance.certificates(App.account, i).then(function (cert) {
                            // Render certificate Result
                            var certificateTemplate = '<tr><td>' + cert[0] + '</td><td>' + cert[1] + '</td><td>' + cert[2] + '</td><td>' + cert[3] + '</td><td>' + cert[4] + '</td></tr>';
                            certificatesResults.append(certificateTemplate);
                        });
                    }
                });

                loader.hide();
                content.show();
                return App.certificationInstance.courseCount();
            })
            .then(function (courseCount) {
                // show courses of constructors address, TODO: show users courses
                var courseOverview = $('#courseOverview');
                courseOverview.empty();
                for (let i = 0; i < courseCount; i++) {
                    App.certificationInstance.getCourseParticipants(i).then(function (participants) {
                        App.certificationInstance.courses(contractAddress, i).then(function (course) {
                            var courseTemplate = '<tr><th>' + course[0] + '</th><td>' + course[1] + '</td><td>';
                            for (let j = 0; j < participants.length; j++) {
                                courseTemplate += participants[j] + '<br>';
                            }
                            courseTemplate += '</td></tr>';
                            courseOverview.append(courseTemplate);
                        });
                    });
                }
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    addCertificate: function () {
        var collector = $('#inputAddress').val();
        var title = $('#inputTitle').val();
        var course = $('#inputCourse').val();

        App.contracts.Certification.deployed()
            .then(function (instance) {
                return instance.addCertificate(collector, title, 7, course);
            })
            .then(function (result) {
                // Render the new balance and all contracts
                App.render();
            })
            .catch(function (err) {
                console.error(err);
            });
    },
};

window.addEventListener('load', function () {
    App.init();
});
