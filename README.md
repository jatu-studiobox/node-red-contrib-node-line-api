# node-red-contrib-node-line-api
LINE API nodes for NODE-RED. Each versin consists of the following nodes:

## Version

1.0.0
* LINE Notify API node
---
## Installation
```
npm install node-red-contrib-node-line-api
```
---

## Help

### LINE Notify API Node

NODE-RED node for sending message notification to LINE Notify.

#### Usage

1. Obtain an Access Token at [LINE Notify](https://notify-bot.line.me/). Then, setup Access Token at LINE Notify API Node.
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

| Property          | Mandatory  | Type            | Description |
| ----------------- |:----------:|:---------------:| ----------- |
| message           | Yes        | string          | 1000 characters max |
| useImageUrl       | Yes        | boolean         | *true* : Use image URL with LINE Notify. Additional *imageFullsizeUrl* and *imageThumbnailUrl* must be specified.<br />*false* : Not use image URL with LINE Notify.|
| imageFullsizeUrl  | *Yes, if useImageUrl is true* | string      | Image URL. Maximum size of 2048×2048px JPEG.  |
| imageThumbnailUrl | *Yes, if useImageUrl is true* | string      | Image URL. size of 240×240px JPEG.  |

#### Reference
[LINE Notify API Document](https://notify-bot.line.me/doc/en/)









