import time
import onewire

class DS18X20:
    def __init__(self, onewire_bus):
        """Initialize DS18X20 sensor with OneWire bus."""
        self.ow = onewire_bus

    def scan(self):
        """Scan for DS18B20 devices and return their addresses."""
        return self.ow.scan()

    def convert_temp(self):
        """Send temperature conversion command to all sensors on the bus."""
        self.ow.reset()
        self.ow.writebyte(0xCC)  # Skip ROM command
        self.ow.writebyte(0x44)  # Start temperature conversion

    def crc8(self, data):
        """Calculate CRC8 checksum for DS18B20 data validation."""
        crc = 0
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 0x01:
                    crc = (crc >> 1) ^ 0x8C  # Polynomial used by DS18B20
                else:
                    crc >>= 1
        return crc

    def read_temp(self, rom):
        """Read temperature from a DS18B20 sensor."""
        self.ow.reset()
        self.ow.select_rom(rom)
        self.ow.writebyte(0xBE)  # Read scratchpad command
        
        data = bytearray(9)  # Create a bytearray to store sensor data
        self.ow.readinto(data)  # Read 9 bytes into the bytearray

        if self.crc8(data[:8]) != data[8]:  # Validate checksum
            return None

        temp_raw = data[0] | (data[1] << 8)  # Convert to 16-bit value
        if temp_raw & 0x8000:  # Negative temperature handling
            temp_raw -= 65536

        return temp_raw / 16.0  # Convert to Celsius

