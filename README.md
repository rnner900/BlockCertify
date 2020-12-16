<img src="BlockCertifyLogo.png" height="35" align="right" />

# BlockCertify ![Cool](https://img.shields.io/badge/%F0%9F%93%9C-certificated-blue)
>Certification instance based on solidity for the Ethereum Blockchain

## Table of Contents

- [About](#about)
- [Functionality](#functionality)
- [Documents](#documents)
- [Requirements](#requirements)
- [Installation](#installation)
- [Run application](#run-application)

## About
Generate consistent and independent certificates. As an issuer you can create courses based on participants addresses and issue certificates to the users of the course. As a participant I want to view received certificates. Any user can log in with metamask with the address and private Key.

## Functionality
* Sign into the webapp using your address with Metamask 
* Create a course 
* Add and Remove participants to/from a course
* Issue certificates for certain participants of a course
* Display certificates and courses assigned to signed in address 
* Display certificates and courses assigned to other addresses (provide search function)

### Certificates
Our certificates contain:
* Issuer address 
* Recipient address 
* Title of certificate 
* Course Id of certificate 

Preview:

<img height="220" src="BlockCertify_Certificate.png">


### Architecture
![architecture](architecture.png)

## Documents
* [Description](https://dhbwstg-my.sharepoint.com/:w:/g/personal/inf18200_lehre_dhbw-stuttgart_de/EQepBS1bCaZKkkIirMOSuSkB5mS8uptXrDt5dB3pTiHiKw?e=5psYY9)
* [Presentation](https://dhbwstg-my.sharepoint.com/:p:/g/personal/inf18200_lehre_dhbw-stuttgart_de/EaSqSujzyTlEosuql-bChuoBrbgE39MxWxldudZCXU6MnQ?e=DM1EkB)

## Requirements
* NodeJS [(download & install)](https://nodejs.org/en/)
* Ganache [(follow the official Quickstart guide)](https://www.trufflesuite.com/docs/ganache/quickstart)
* Metamask Browser Plugin [(install in your browser, supports Chrome, Firefox, IE and Brave)](https://metamask.io/download.html)

## Installation
1. Clone this repository. (`git clone https://github.com/rnner900/BlockCertify.git`)
2. Navigate to the project in terminal. (`cd BlockCertify`)

3. running `npm install` in the directory will install all needed node modules and dependencies
4. running `npm install -g truffle` will install [Truffle](https://www.npmjs.com/package/truffle) the used development environment for Ethereum

## Run application

1. Make sure ganache is running (on http://127.0.0.1:7545 which is default in [Quickstart](https://www.trufflesuite.com/docs/ganache/quickstart) but can be changed in the [Settings](https://www.trufflesuite.com/docs/ganache/reference/ganache-settings))
2. Run `truffle migrate --reset` to compile the smart contracts
3. Run `npm run dev` to launch the `lite-server`
4. Connect to the Frontend with Metamask in your Browser [(step-by-step guide,](https://github.com/mkqavi/dhbw-truffle-project#connect-to-frontend-in-browser) do step 1-5) and import your ganache account data into Metamask by its private key

