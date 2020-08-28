EIT-Hub Communication
=====================

Design goals
---
* A just works messaging protocol.
* Undefined from device to inter ui.
* That do not try to hide reliability problems.
* Fails fast. Don't send if not going to work.
* Expect that application developers do not know what they are doing.
    * Will fail unreasonable requests.
    * Will fail thundering horde requests.
* App developer express requirements not low level details.
    * **To and from address**.
        * From is auto populated. But can be set to something else.
    * **On success** criteria. When to report back to the application that the message completed. 
        * **On send.** The message have been sent. For a UTP type packet
        * **On received.** The message have been reived and acknowledgement is sent back.
        * **On Ordered.** Messages is only done if every messages send before also have arrived. TCP like stream.
        * **On persisted.** The message have been stored to a persistent cache somewhere and is on its way towards its target at some point. Ultimate success or failure message is sent to the from address.
    * **Timeout to success.** The maximum time you are willing to wait for a success before the job is canceled. And sending of message errors out. The platform will error out before timeout if sees no way to deliver the message in time.
    * **Timeout to delivery.** The max time to spend trying to get message to its destination. May timeout early if there is little to no chance of delivery. Default same success timeout.
    * **Data type** The data type of the message. Decides how the platform may transform the payload. Some examples:
        * Opaque blob: Just binary data that platform can do anything with.
        * Text: Utf8 text without any meaning or format.
        * JSON: The platform can convert this to any JSON compatible formats like message pack. As long as en equivalent message is available on the other side. Will remove whitespace at least.
        * Lossy Picture: The platform is allowed to reduce quality to improve chance of delivery.
        * Lossy Video: The platform is allowed to reduce quality to improve chance of delivery.
    * **Priority.** 1-9 on how valuable the message is. Acknowledgement is always sent at one hight than the message. This decide both what message is sent first and over what link. Low priority messages is not sent over expensive networks.
        * 8-9 Critical alerts
        * 6-7 Realtime interactive messages. Remote control.
        * 3-5 Normal application telemetry and commands.
        * 1-2 Bulk transfer of large or many messages.
* Communication should be agnostic on types of networks. And should not re-implement stuff the underlying protocols provide.
* Should integrate with existing messaging systems.
    * Azure Event Hub / Azure IoT.
    * Robot Operating System.

MVP
---
* UI internal messaging system.
* UI to backend websocket connection. With a minimal of protocol.
* Backend to device websocket connection. With a minimal of protocol.
* Use azure iot only for setting up websocket connection.