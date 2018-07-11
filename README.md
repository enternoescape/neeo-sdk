# NEEO SDK [![Build Status](https://travis-ci.org/NEEOInc/neeo-sdk.svg?branch=master)](https://travis-ci.org/NEEOInc/neeo-sdk) [![Greenkeeper badge](https://badges.greenkeeper.io/NEEOInc/neeo-sdk.svg)](https://greenkeeper.io/)

This is the source code of the NEEO SDK to interact with the NEEO Brain.

If you're looking for examples, take a look at the example repository at https://github.com/NEEOInc/neeo-sdk-examples

## Table of Contents
<!-- Table of contents generated generated by http://tableofcontent.eu -->
- NEEO SDK
  - [Prerequisite](#prerequisite)
    - [Windows OS](#windows-os)
  - [NEEO-SDK CLI](#neeo-sdk-cli)
    - [Using the CLI for your own project](#using-the-cli-for-your-own-project)
    - [Using the CLI to run Third Party drivers](#using-the-cli-to-run-third-party-drivers)
      - [Get driver ready to be used by others](#get-driver-ready-to-be-used-by-others)
      - [Installing and running](#installing-and-running)
  - [SDK Documentation](#sdk-documentation)
- [Hints](#hints)
- [NEEO Macro Names](#neeo-macro-names)
  - [Power Control Capability](#power-control-capability)
  - [Volume Control Capability](#volume-control-capability)
  - [Favorites View Capability](#favorites-view-capability)
  - [Numpad Capability](#numpad-capability)
  - [Controlpad Capability](#controlpad-capability)
  - [Color Buttons Capability](#color-buttons-capability)
  - [MENU Capability](#menu-capability)
  - [Channel Zapper Capability](#channel-zapper-capability)
  - [Transport Capability](#transport-capability)
  - [Record Capability](#record-capability)
  - [Input Capability](#input-capability)
- [Other SDK implementations](#other-sdk-implementations)


## Prerequisite

* You must have at least Node.js v6 installed, see http://nodejs.org

### Windows OS

* If you use the SDK on Windows we suggest to install Apple iTunes (or the Bonjour SDK for Windows, available from the https://developer.apple.com site). Windows versions < 10 seems to miss multicast DNS support (aka. Bonjour/Zeroconf). This means the Brain discovery find's a NEEO Brain but you cannot connect to the NEEO Brain (as the discovery fails). You can test if multicast DNS works on your machine when you try to `ping NEEO-xxxxxxxx.local` (replace xxxxxxxx with the unique hostname of your NEEO Brain).

## NEEO-SDK CLI

The SDK is bundled with a CLI tool allowing to start a SDK instance and load device drivers automatically. :rocket: This makes it very easy to run multiple SDK drivers. Check the `npm start` command in the neeo-sdk-examples repository.

### Using the CLI for your own project
To use it for your own driver, either update the NPM script:

```
"scripts": {
  [...]
  "start": neeo-sdk start"
}
```

or it directly (in your project's folder, with the SDK installed) with the `start` parameter, for instance:

```
./node_modules/.bin/neeo-sdk start
```

Then, in your driver project, you need to have a directory called 'devices' at the root, where your devices are located. The folder can be configured through the environment variable `NEEO_DEVICES_DIRECTORY` (for instance `NEEO_DEVICES_DIRECTORY="./lib/devices"`).
To expose your devices to the CLI, you need to export them like so:

```
const lifx = neeoapi.buildDevice('My Smart Light')
  .setManufacturer('LIFX')
 [...]

module.exports = {
  devices: [lifx]
};
```

It's important to note that the CLI doesn't search the directories recursively in order to find devices. This means that if you want to separate your devices using directories, you need to create an `index.js` file inside each one of them and export the device(s) from there.

It's also possible to explicitly exclude directories from the devices search, by adding them to the `NEEO_DEVICES_EXCLUDED_DIRECTORIES` environment variable, for instance: `NEEO_DEVICES_EXCLUDED_DIRECTORIES=["lifx-cloud"]`

By default, the CLI will connect to the first discovered brain within the network. You can change this behaviour by creating a `"neeoSdkOptions"` property in your project's `package.json`, and set the "brainHost" property to the Brain IP address. Following parameters are available:

```
"neeoSdkOptions": {
  "brainHost": "10.0.0.131", // If configured, connect to the brain through its IP. Otherwise, connect to the first discovered one.
  "brainPort": 3001, // The Brain port. Only relevant when brainHost is defined. Default to 3000
  "serverName": "myServer", // The name of the SDK server. Default to 'default'
  "serverPort": 6637, // The port of the SDK server. Default to 6636
}
```

The Brain lookup uses a default timeout of 5000ms. To change this behaviour, change the environment variable `NEEO_BRAIN_LOOKUP_DURATION_MS`

To migrate a driver to the new CLI, follow:
[Driver migration guide to 0.50.0](./MIGRATION-0-50-0.md). Note: We have updated the example code too, take a look there if something is unclear.

If you need to run the CLI directly through a node process (for process management or to attach a debugger) you can run it via `node ./node_modules/neeo-sdk/cli/index.js start`

### Using the CLI to run Third Party drivers

The CLI is also able to run third-party devices. This can either be only third-party devices or a mix of third-party devices and your own drivers in the same project.

#### Get driver ready to be used by others
The exposed devices need to be exported in an index file in the devices/ directory, the same way as documented above. Note that in order to be detected during the start of an SDK instance, your driver needs to be named with a 'neeo-' or 'neeo_' prefix. For instance: 'neeo-simple-accessory'.

#### Installing and running

The installation of a third-party driver is done through a simple ```npm install```. This can either be from the official npm registry or GitHub. Then you can run the third-party drivers with:

```
npm install neeo-sdk
./node_modules/.bin/neeo-sdk start
```

## SDK Documentation

See https://neeoinc.github.io/neeo-sdk/

# Hints

A collection of hints if you create a device driver.

* If possible provide a device discovery to find a device to support (`.enableDiscovery`) - this is the most user friendly way for the user to add a device.
* Make sure that your driver handles if the device reboots. It's possible that the device IP changed after the reboot.
* Make sure to handle the case when the user deleted the device from the NEEO Brain, so the driver won't send notifications anymore and shut down any running services (`registerDeviceSubscriptionHandler`).
* Make sure your driver allocate resources only if needed - use the `registerInitialiseFunction` to initialise your driver.
* List the minimal firmware version of the device you use - this might help if a driver does not work as expected.

# NEEO Macro Names

The view for a device in the recipe is generated automatically depending on the device capabilities.

## Power Control Capability

If your device supports Power control (power on device, power off device), add this capability - the generated recipe
will power on and off your device automatically.

You need to add support for the following buttons (`addButton({..`):
* `POWER ON`
* `POWER OFF`

or just use the shortcut function `.addButtonGroup('POWER')`


## Volume Control Capability

If your device supports Volume control (volume up and down, optional mute toggle), add this capability - the generated recipe
will automatically use the volume capability of your device.

You need to add support for the following buttons (`addButton({..`):
* `VOLUME UP`
* `VOLUME DOWN`
* optionally `MUTE TOGGLE`

or just use the shortcut function `.addButtonGroup('VOLUME')`

## Favorites View Capability

If you want support for a custom Favorite view, you need to add support for the following buttons (`addButton({..`):
* `DIGIT 0`
* `DIGIT 1`
* `DIGIT 2`
* `DIGIT 3`
* `DIGIT 4`
* `DIGIT 5`
* `DIGIT 6`
* `DIGIT 7`
* `DIGIT 8`
* `DIGIT 9`

or just use the helper function `.addButtonGroup('Numpad')`. The device must be one of the following types:

* `TV`
* `DVB` (aka Satellite box, digital receiver)
* `TUNER` (audio tuner)

## Numpad Capability

If you want to add a numpad widget to your view, make sure to implement all the `DIGIT` buttons of the "Favorites View Capability". Supported for `TV`and `DVB` devices.

## Controlpad Capability

To create a Controlpad capability you need to implement the following buttons (`addButton({..`):
* `CURSOR ENTER`
* `CURSOR UP`
* `CURSOR DOWN`
* `CURSOR LEFT`
* `CURSOR RIGHT`

or just use the helper function `.addButtonGroup('Controlpad')`. The devicetype must be `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER`, `VOD`, `DVD` or `PROJECTOR`.

## Color Buttons Capability

To create a Controlpad capability you need to implement the following buttons (`addButton({..`):
* `FUNCTION RED`
* `FUNCTION GREEN`
* `FUNCTION YELLOW`
* `FUNCTION BLUE`

or just use the helper function `.addButtonGroup('Color Buttons')`. The devicetype must be `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER` or `PROJECTOR`.

## MENU Capability

To create a MENU (navigation) capability you need to implement the following buttons (`addButton({..`):
* `MENU`
* `BACK`

or just use the helper function `.addButtonGroup('Menu and Back')`. In most cases it make sense to include the Controlpad capability aswell.

## Channel Zapper Capability

To create a Channel Zapper capability (Channel Up/Down) you need to implement the following buttons (`addButton({..`):
* `CHANNEL UP`
* `CHANNEL DOWN`

or just use the helper function `.addButtonGroup('Channel Zapper')`.

## Transport Capability

If you want to support different transport features (like skip, forward, next) you can include the following buttons (`addButton({..`):
* `PLAY`, `PAUSE`, `STOP` (helper function: `.addButtonGroup('Transport')`)
* `REVERSE`, `FORWARD` (helper function: `.addButtonGroup('Transport Search')`)
* `PREVIOUS`, `NEXT` (helper function: `.addButtonGroup('Transport Scan')`)
* `SKIP SECONDS BACKWARD`, `SKIP SECONDS FORWARD` (helper function: `.addButtonGroup('Transport Skip')`)

This works for the devices `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER`, `VOD`, `DVD` or `PROJECTOR`.

## Record Capability

To create a Record capability you need to implement the following buttons (`addButton({..`):
* `MY RECORDINGS`
* `RECORD`
* `LIVE`

or just use the helper function `.addButtonGroup('Record')`. The devicetype must be `TV`, `DVB`. Please note, if you don't have all 3 buttons you can implement only the buttons your device provides.

## Input Capability

If you add support for a devicetype `TV`, `PROJECTOR` or `AVRECIEVER` you should provide discrete input change commands depending of your devices features, for example:
* `INPUT HDMI 1`
* `INPUT HDMI 2`
* `INPUT VGA 1`
* `INPUT SCART 1`

# Other SDK implementations

Thanks to the contributors for porting the SDK to other platforms.

- C# implementation by Christian Riedl: https://github.com/ChristianRiedl/NeeoApi
- ESP8266 implementation by grumpyengineer https://github.com/grumpyengineer/ESP8266NeeoSDK
