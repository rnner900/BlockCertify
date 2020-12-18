<img src="BlockCertifyLogo.png" height="35" align="right" />

# BlockCertify ![Cool](https://img.shields.io/badge/%F0%9F%93%9C-certificated-blue)
>Certification instance based on solidity for the Ethereum Blockchain. Blockchain Project at the DHBW Stuttgart by Group 4.

## Table of Contents

- [About](#about)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [Installation](#installation-guide)

## About
This DApp is a Certification System that uses a Blockchain for storing Certificates and Courses. There are two roles: issuer, participant. 

As an issuer you can create courses. The issuer can add and remove participants addresses to the course. After that the course owner can generate certificates for a selection of the course participants. These certificates are stored in a ethereum block chain as transactions of a smart contract. 
As a participant the application displays courses he participates and certificates he received. 
Both roles log in with metamask with the address and private Key for the (local) blockchain. 
You can learn more about this project by reading the documentation. 

## Documentation
---> [Documentation](Documentation.pdf) <---

---> [Presentation](Presentation.pdf) <---

## Requirements
* NodeJS [(download & install)](https://nodejs.org/en/)
* Ganache [(follow the official Quickstart guide)](https://www.trufflesuite.com/docs/ganache/quickstart)
* Metamask Browser Plugin [(install in your browser, supports Chrome, Firefox, IE and Brave)](https://metamask.io/download.html)

## Installation Guide
---> You can simply follow the steps of the step by step [Installation & Running Guide](InstallationGuide.pdf) <---

Installation:
1. Clone this repository. (`git clone https://github.com/rnner900/BlockCertify.git`)
2. Navigate to the project in terminal. (`cd BlockCertify`)
3. running `npm install` will install all needed node modules and dependencies
4. running `npm install -g truffle` will install [Truffle](https://www.npmjs.com/package/truffle) the used development environment for Ethereum

Running:
1. Make sure ganache is running (on http://127.0.0.1:7545 which is default in [Quickstart](https://www.trufflesuite.com/docs/ganache/quickstart) but can be changed in the [Settings](https://www.trufflesuite.com/docs/ganache/reference/ganache-settings))
2. Run `truffle migrate --reset` to compile the smart contracts
3. Run `npm run dev` to launch the `lite-server`
4. Connect to the Frontend with Metamask in your Browser [(step-by-step guide,](https://github.com/mkqavi/dhbw-truffle-project#connect-to-frontend-in-browser) do step 1-5) and import your ganache account data into Metamask by its private key


## Developers
Group 4 of Blockchain course at DHBW Stuttgart:
Daniel Widmayer
Jacob Haase
Theo Remmert
Tobias Böck

(matriculation numbers are listed in the documentation)

## Developer Links
* [Team Description](https://dhbwstg-my.sharepoint.com/:w:/g/personal/inf18200_lehre_dhbw-stuttgart_de/EQepBS1bCaZKkkIirMOSuSkB5mS8uptXrDt5dB3pTiHiKw?e=5psYY9)
* [Team Presentation](https://dhbwstg-my.sharepoint.com/:p:/g/personal/inf18200_lehre_dhbw-stuttgart_de/EaSqSujzyTlEosuql-bChuoBrbgE39MxWxldudZCXU6MnQ?e=DM1EkB)

