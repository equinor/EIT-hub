extern crate linux_embedded_hal as hal;
extern crate ltr_559;
use ltr_559::{AlsGain, AlsIntTime, AlsMeasRate, Ltr559, SlaveAddr};

fn main() {
    let dev = hal::I2cdev::new("/dev/i2c-1").unwrap();
    let address = SlaveAddr::default();
    let mut sensor = Ltr559::new_device(dev, address);
    let manufacturer_id = sensor.get_manufacturer_id().ok().unwrap();
    println!("Manufacturer ID = 0x{:02x}", manufacturer_id);
    let part_id = sensor.get_part_id().ok().unwrap();
    println!("Part ID = 0x{:02x}", part_id);

    sensor.set_als_meas_rate(AlsIntTime::_50ms, AlsMeasRate::_50ms).unwrap();
    sensor.set_als_contr(AlsGain::Gain4x, false, true).unwrap();
    
    loop {
        let status = sensor.get_status().unwrap();
        if status.als_data_valid {
            let lux = sensor.get_lux().unwrap();
            println!("Lux = {}" , lux);
        }
        if status.ps_data_status {
            let (proximity, saturation) = sensor.get_ps_data().unwrap();
            println!(
                "Proximity = {}, Saturation = {}",
                proximity, saturation
            );
        }
    }
}