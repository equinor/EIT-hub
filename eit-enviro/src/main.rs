extern crate linux_embedded_hal as hal;
extern crate ltr_559;
use rumqttc::QoS;
use std::sync::Arc;
use rumqttc::MqttOptions;
use rumqttc::Client;
use rumqttc::ClientConfig;
use ltr_559::{AlsGain, AlsIntTime, AlsMeasRate, Ltr559, SlaveAddr};
use std::env;
use serde::{Serialize, Deserialize};



fn main() {
    let args:Vec<String> = env::args().collect();
    let mut sensor = setup_sensor();
    let (mut client, mut connection) = setup_mqtt(&args[1]);

    std::thread::spawn(move || {
        // we are not handling incoming requests
        for _ in connection.iter() {}
    });

    let mut enviro = Enviro{lux: 0.0};
    
    loop {
        let status = sensor.get_status().unwrap();
        if status.als_data_valid {
            enviro.lux = sensor.get_lux().unwrap();
            let _ = client.publish("public/eithub/enviro", QoS::AtMostOnce, false, serde_json::to_vec(&enviro).unwrap());
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct Enviro {
    lux: f32,
}


fn setup_sensor() -> ltr_559::Ltr559<hal::I2cdev, ltr_559::ic::Ltr559> {
    let dev = hal::I2cdev::new("/dev/i2c-1").unwrap();
    let address = SlaveAddr::default();
    let mut sensor = Ltr559::new_device(dev, address);
    let manufacturer_id = sensor.get_manufacturer_id().ok().unwrap();
    println!("Manufacturer ID = 0x{:02x}", manufacturer_id);
    let part_id = sensor.get_part_id().ok().unwrap();
    println!("Part ID = 0x{:02x}", part_id);

    sensor.set_als_meas_rate(AlsIntTime::_50ms, AlsMeasRate::_50ms).unwrap();
    sensor.set_als_contr(AlsGain::Gain4x, false, true).unwrap();
    sensor
}

fn setup_mqtt(passwd: &str)-> (rumqttc::Client, rumqttc::Connection) {
    let mut config = ClientConfig::new();
    config.root_store.add_server_trust_anchors(&webpki_roots::TLS_SERVER_ROOTS);

    let mut mqtt_options = MqttOptions::new("eit-enviro", "eit-hub-broker.northeurope.cloudapp.azure.com", 8883);
    mqtt_options.set_keep_alive(5);
    mqtt_options.set_credentials("device", passwd);
    mqtt_options.set_tls_client_config(Arc::new(config));

    Client::new(mqtt_options, 20)
}