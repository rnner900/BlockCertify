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

        if (typeof web3 === 'undefined' && !window.location.hash) {
            // Metamask not installed
            alert('Metamask is not installed, please install Metamask if you want to use this application.');
            return;
        }

        // check if user is logged in to Metamask
        web3.eth.getAccounts(function (err, accounts) {
            if (err != null) console.error('An error occurred: ' + err);
            else if (accounts.length == 0) console.log('User is not logged in yet.');
            else window.location.href = 'http://localhost:3000/start.html';
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

        await ethereum.enable();

        window.location.href = 'http://localhost:3000/start.html';
    },
};

window.addEventListener('load', function () {
    App.init();
    // workaround for issue https://github.com/MetaMask/metamask-extension/issues/7221
    if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
});
