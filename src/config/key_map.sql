use bookingcare;		
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) VALUES ('ROLE', 'R1', 'Admin', 'Quản trị viên');						
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('ROLE','R2','Doctor', 'Bác sĩ' ); 									
INSERT INTO `bookingcare`.`allcodes`  (`type`, `keyMap`, `valueEn`, `valueVn`) values ('ROLE','R3','Patient', 'Bệnh nhân' ); 									
									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('STATUS','S1','New', 'Lịch hẹn mới' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('STATUS','S2','Confirmed', 'Đã xác nhận' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('STATUS','S3','Done', 'Đã khám xong' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('STATUS','S4','Cancel', 'Đã hủy' ); 									
									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T1','8:00 AM - 9:00 AM', '8:00 - 9:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T2','9:00 AM - 10:00 AM', '9:00 - 10:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T3','10:00 AM - 11:00 AM', '10:00 - 11:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T4','11:00 AM - 0:00 PM', '11:00 - 12:00' ); 									
									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T5','1:00 PM - 2:00 PM', '13:00 - 14:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T6','2:00 PM - 3:00 PM', '14:00 - 15:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T7','3:00 PM - 4:00 PM', '15:00 - 16:00' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('TIME','T8','4:00 PM - 5:00 PM', '16:00 - 17:00' ); 									
									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('POSITION','P0','None', 'Bác sĩ' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('POSITION','P1','Master', 'Thạc sĩ' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('POSITION','P2','Doctor', 'Tiến sĩ' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('POSITION','P3','Associate Professor', 'Phó giáo sư' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('POSITION','P4','Professor', 'Giáo sư' ); 									
									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('GENDER','M','Male', 'Nam' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('GENDER','F','Female', 'Nữ' ); 									
INSERT INTO `bookingcare`.`allcodes`(`type`, `keyMap`, `valueEn`, `valueVn`) values ('GENDER','O','Other', 'Khác' ); 	

INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI1','10', '200000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI2','15', '250000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI3','20', '300000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI4','25', '350000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI5','30', '400000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI6','35', '450000' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PRICE','PRI7','40', '500000' ); 									
									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`)values ('PAYMENT','PAY1','Cash', 'Tiền mặt' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PAYMENT','PAY2','Credit card', 'Thẻ ATM' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PAYMENT','PAY3','All payment method', 'Tất cả' ); 									
									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO1','Ha Noi', 'Hà Nội' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO2','Ho Chi Minh', 'Hồ Chí Minh' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO3','Da Nang', 'Đà Nẵng' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO4','Can Tho', 'Cần Thơ' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO5','Binh Duong', 'Bình Dương' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO6','Dong Nai', 'Đồng Nai' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO7','Quang Ninh', 'Quảng Ninh' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO8','Hue', 'Thừa Thiên Huế' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO9','Quang Binh', 'Quảng Bình' ); 									
INSERT INTO `bookingcare`.`allcodes` (`type`, `keyMap`, `valueEn`, `valueVn`) values ('PROVINCE','PRO10','Khanh Hoa', 'Khánh Hòa' ); 								




















						