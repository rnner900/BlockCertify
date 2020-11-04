App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        /* Web3:
         * web3.js is a javascript library that allows our client-side
         * application to talk to the blockchain. We configure web3 here.
         */
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
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

    render: function () {
        var certificationInstance;
        var loader = $('#loader');
        var content = $('#content');

        // loader.show();
        // content.hide();

        // Load account data
        web3.eth.getCoinbase(async function (err, account) {
            if (err === null) {
                if (window.ethereum) {
                    ethereum.enable().then(function (acc) {
                        App.account = acc[0];
                        $('#accountAddress').html('Your Account: ' + App.account);
                    });
                }

                balance = web3.eth.getBalance(account, function (err, balance) {
                    $('#accountBalance').html('Your Balance: ' + balance);
                    console.log(balance);
                    App.balance = balance;
                });
            }
        });

        // Load contract data
        App.contracts.Certification.deployed()
            .then(function (instance) {
                certificationInstance = instance;
                return certificationInstance.certificateCount();
            })
            .then(function (certificateCount) {
                var certificatesResults = $('#certificatesResults');
                certificatesResults.empty();

                for (var i = 1; i <= certificateCount; i++) {
                    certificationInstance.certificates(i).then(function (certificate) {
                        var id = certificate[0];
                        var publisher = certificate[1];
                        var collector = certificate[2];
                        var title = certificate[3];
                        var course = certificate[4];

                        // Render candidate Result
                        var certificateTemplate = '<tr><th>' + id + '</th><td>' + publisher + '</td><td>' + collector + '</td><td>' + title + '</td><td>' + course + '</td></tr>';
                        certificatesResults.append(certificateTemplate);
                    });
                }
                loader.hide();
                content.show();
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
                return instance.addCertificate(collector, title, course, { from: App.account });
            })
            .then(function (result) {
                // Wait for votes to update
                // $("#content").hide();
                // $("#loader").show();
            })
            .catch(function (err) {
                console.error(err);
            });
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
