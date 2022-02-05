# node-red-contrib-node-line-api
LINE API nodes for NODE-RED. Such as LINE notify.

## Node LINE API in package
* LINE Notify API node
---
## Installation
```
npm install node-red-contrib-node-line-api
```
---
## Release Notes

### Version 0.6.0
* Fix LINE Notify node. Change to use 'payload' property instead of 'message'. See [help](#Help) for more detail.
* Fix LINE Notify node. Properties 'useImageUrl', 'useImageFile' and 'useSticker' change to 'no mandatory'. See [help](#Help) for more detail.
* Fix LINE Notify node. Fix examples for support new changing.
* Change help.

### Version 0.5.3
* Fix upload image, check existing image file
* Add example flows for LINE Notify API
* Add bugs URL supplied
* Add something in package.json
* Fix README
* Remove none use packages

### Version 0.5.2
* Fix Help and README

---
## Help

### LINE Notify API Node

NODE-RED node for sending message notification to LINE Notify. You can use LINE notify API through this Node, include uploading image file.

#### Usage

1. Obtain an Access Token at <a href="https://notify-bot.line.me/" target="_blank">LINE Notify</a>. Then, setup Access Token at LINE Notify API Node.
2. Setup Node mode
* Node-self data - Input notify data by Node UI
* External Node data - Receive data from outside Node. See "Node API" below.
3. Setup other notify options
4. Run workflow
5. Check result.

#### Node API
You can send your information, which you want to notify at LINE Notify, through *LINE Notify API Node*.

##### Input
Using *msg* object.

| Property          | Mandatory                                   | Type        | Description |
| ----------------- |:-------------------------------------------:|:-----------:| ----------- |
| payload           | Yes                                         | string      | 1000 characters max |
| useImageUrl       | No (If not send, automated set to 'false')  | boolean     | *true* : Use image URL with LINE Notify. Additional *imageFullsizeUrl* and *imageThumbnailUrl* must be specified.<br />*false* : Not use image URL with LINE Notify.|
| imageFullsizeUrl  | No (*Yes, if useImageUrl is true*)          | string      | Image URL. Maximum size of 2048×2048px JPEG.  |
| imageThumbnailUrl | No (*Yes, if useImageUrl is true*)          | string      | Image URL. Maximum size of 240×240px JPEG.    |
| useImageFile      | No (If not send, automated set to 'false')  | boolean     | *true* : Upload a image file to the LINE server. Additional *imageFile* must be specified.<br />*false* : Not upload a image file to the LINE server.|
| imageFile         | No (*Yes, if useImageFile is true*)         | string      | Should be an absolute path to upload image file, e.g. C:\folder\image.jpg (Support .png and .jpg)<br />If you specified all *imageFullsizeUrl*, *imageThumbnailUrl* and *imageFile*. The *imageFile* takes precedence. See more detail at <a href="https://notify-bot.line.me/doc/en/" target="_blank">LINE Notify API Document</a> |
| useSticker        | No (If not send, automated set to 'false')  | boolean     | *true* : Use sticker with LINE Notify. Additional *stickerPackageId* and *stickerId* must be specified.<br />*false* : Not use sticker with LINE Notify.|
| stickerId         | No (*Yes, if useSticker is true*)   | number      | LINE Sticker Id. See more details at [LINE List of available stickers](https://developers.line.biz/en/docs/messaging-api/sticker-list/) |
| stickerPackageId  | No (*Yes, if useSticker is true*)   | number      | LINE Package Id of sticker Id. See more details at <a href="https://developers.line.biz/en/docs/messaging-api/sticker-list/" target="_blank">LINE List of available stickers</a> |

##### Output
Using *msg* object.

| Property          | Type        | Description |
| ----------------- |:-----------:| ----------- |
| status            | number      | Result status code |
| payload           | string      | Result status message |

#### More details
See more details at <a href="https://notify-bot.line.me/doc/en/" target="_blank">LINE Notify API Document</a>.

See more details about Sticker ID and Package ID at <a href="https://developers.line.biz/en/docs/messaging-api/sticker-list/" target="_blank">LINE List of available stickers</a>.
