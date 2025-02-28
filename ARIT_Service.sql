-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Feb 28, 2025 at 10:28 AM
-- Server version: 9.1.0
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ARIT_Service`
--

-- --------------------------------------------------------

--
-- Table structure for table `Books`
--

CREATE TABLE `Books` (
  `BookQR` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `BookID` varchar(11) NOT NULL,
  `Bookname` varchar(450) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Booktype` varchar(225) NOT NULL,
  `Bookaddress` varchar(255) NOT NULL,
  `Bookstate` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Books`
--

INSERT INTO `Books` (`BookQR`, `BookID`, `Bookname`, `Booktype`, `Bookaddress`, `Bookstate`) VALUES
('T0144794', 'b00003865', 'การบริหารลูกค้าสัมพันธ์ = Customer relationship managment / ชื่นจิตต์ แจ้งเจนกิจ.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0145766', 'b00005832', 'ล้มแล้วลุก ปลุกเอเซีย : จากเศรษฐกิจฟองสบู่สู่เศรษฐกิจแบบยั่งยืน / Philip Kotler, Hermawan Kartajaya ; เกียรติชัย พงษ์พาณิชย์ แปลและเรียบเรียง.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0185744', 'b00012618', 'คำพิพากษาฎีกา ประจำพุทธศักราช 2556 ตอนที่ 8 / สมชัย ฑีฆาอุตมากร, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสืออ้างอิงนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0185745', 'b00012619', 'คำพิพากษาฎีกา ประจำพุทธศักราช 2556 ตอนที่ 9 / สมชัย ฑีฆาอุตมากร, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0181857', 'b00012690', 'แนวคิด ทฤษฎี เทคนิค และการประยุกต์เพื่อการพัฒนาสังคม = Concept,theory and technique for social development practice / พัชรินทร์ สิรสุนทร.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'ดูที่ชั้น'),
('T0184803', 'b00014816', 'เจ้าโย่งคอยาว / เรื่อง : สุชาดา ลิมป์ ; ภาพ : ลอร่าจีน เรย์.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0184804', 'b00014817', 'พระราชาผู้เดียวดายกับนกแก้วสอพลอ / เรื่อง : วรรณา หวังกิตติพรป์ ; ภาพ : รุ้งกาญจน์ แก้วสุวรรณ เจอร์ราร์ด.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0184805', 'b00014818', 'พ่อค้าเร่กับสิงโต / เรื่อง : ดลนภา โง่นใจรักษ์ ; ภาพ : ธเรศร์ กังกริช.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0186869', 'b00014947', 'ประเพณีท้องถิ่นไทย.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0187835', 'b00015936', 'การจัดการทรัพยากรมนุษย์ = Human resource management / อนันต์ชัย คงจันทร์', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0198266', 'b00020126', 'นโยบายสาธารณะและการวางแผน = Public policy and planning : เอกสารการสอนชุดวิชา / สาขาวิชาวิทยาการจัดการ มหาวิทยาลัยสุโขทัยธรรมาธิราช.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'ดูที่ชั้น'),
('T0200966', 'b00026734', 'อาเซียน-จีน ทั้งปีนเกลียว ทั้งเกี่ยวก้อย / เกียรติชัย พงษ์พาณิชย์.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'ดูที่ชั้น'),
('T0212368', 'b00036888', 'ป๋องแป๋งรักยาย / สองขา ; มงคล หวานฉ่ำ, ภาพประกอบ', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0212367', 'b00036891', 'ป๋องแป๋งโกรธแล้วนะ / สองขา ; ยาณี เรือนทอง, ภาพประกอบ', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0211195', 'b00037922', 'นวัตกรรมการศึกษาวอลดอร์ฟในระดับชั้นอนุบาล = Waldorf education/ ศิรประภา พฤทธิกุล', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0158973', 'b00043778', 'นโยบายสาธารณะ : แนวความคิด กระบวนการ และการวิเคราะห์ / มยุรี อนุมานราชธน.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0159155', 'b00044068', 'การศึกษาการดำเนินงานโครงการอนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม ของโรงเรียนตำรวจตระเวนชายแดน สังกัดกองกำกับการตำรวจตระเวนชายแดนที่ 31 / ธนชัย มะธิปิไขย.', 'TH - ปริญญานิพนธ์ (Thesis)', 'วิทยานิพนธ์, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0160009', 'b00044262', 'อยุธยา / ชาญวิทย์ เกษตรศิริ, บรรณาธิการ.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0164090', 'b00048985', 'ชีวโมเลกุล / สุกัญญา สุนทรส, วิเชียร ริมพณิชยกิจ.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0172804', 'b00053323', 'การจัดการความสัมพันธ์กับลูกค้า = Customer relationship management / คำนาย อภิปรัชญาสกุล.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0175122', 'b00054349', 'สารบาญคำพิพากษาฎีกา ประจำพุทธศักราช 2536 / ไพโรจน์ วายุภาพ, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0175105', 'b00054361', 'คำพิพากษาฎีกา ประจำพุทธศักราช 2535 ตอนที่ 9 / ไพโรจน์ วายุภาพ, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0174972', 'b00054402', 'คำพิพากษาฎีกา ประจำพุทธศักราช 2532 ตอนที่ 5 / ประดิษฐ์ เอกมณี, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0174966', 'b00054461', 'คำพิพากษาฎีกา ประจำพุทธศักราช 2531 ตอนที่ 12 / สุชาติ สุขสุมิตร, บรรณาธิการ.', 'LR - หนังสืออ้างอิงนิติศาสตร์ (Law Reference Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0181945', 'b00057466', 'เกร็ดกฎหมาย วิ.อาญา / สมศักดิ์ เอี่ยมพลับใหญ่.', 'LG - หนังสือทั่วไปนิติศาสตร์ (Law General Books)', 'หนังสือทั่วไปนิติศาสตร์, หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0105891', 'b00058378', 'เศรษฐศาสตร์ว่าด้วยการประกัน / จุฬาลงกรณ์มหาวิทยาลัย.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'อยู่ระหว่างการทำรายการ'),
('T0183597', 'b00058824', 'ปีกของหนู / สุดไผท เมืองไทย.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'อยู่ระหว่างการทำรายการ'),
('T0183746', 'b00059059', 'ระเบียบสำนักนายกรัฐมนตรี ว่าด้วยงานสารบรรณ พ.ศ. 2526 (ฉบับปรับปรุง 2554) / บาลานซ์ (ติวเตอร์หมู), พงษ์เกตุ เติมกิจธนสาร.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (ปีพิมพ์ 2550-ปีปัจจุบัน), หอสมุดกลาง ชั้น 3 โซน A', 'ดูที่ชั้น'),
('T0130536', 'b00065765', 'สรีรวิทยาของพืช = Plant physiology / กฤษฎี เกียรติชนก.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0133884', 'b00065828', 'เทคนิคเพาะเลี้ยงปลาตู้ / ชูศักดิ์ แสงธรรม.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0152535', 'b00068688', 'การตลาดธุรกิจบริการ = Servive Marketing / วีระรัตน์ เลิศกิจไพรโรจน์.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'คลังหนังสือ (ปีพิมพ์ 2540-2549), หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0215941', 'b00069133', 'การวิเคราะห์เควอซิทินด้วยตัวตรวจวัดทางเคมีไฟฟ้าในผัก ผลไม้ และสมุนไพรไทย : รายงานวิจัย = Quercetin analysis with electrochemical detector in vegetables, fruits, and thai herbs / อัญชนา ปรีชาวรพันธ์.', 'RE - วิจัย (Research)', 'วิจัย, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0221659', 'b00076451', 'กายวิภาค การออกกำลังกายแบบฝึกกล้ามเนื้อ / เฟรดเดอริค เดอลาวีเย ; สนธยา มานะวัฒนา, ผู้แปล.', 'BK-TH - หนังสือทั่วไปภาษาไทย (General Books)', 'หนังสือทั่วไปภาษาไทย (หนังสือคณะพยาบาลศาสตร์), หอสมุดกลาง ชั้น 3 โซน A', 'ดูที่ชั้น'),
('T0221932', 'b00076665', 'สุดแดนรัก / ยอนิม.', 'Fic - นวนิยาย (Fiction)', 'นวนิยาย, หอสมุดกลาง ชั้น 2 โซน B', 'ดูที่ชั้น'),
('T0224025', 'b00078100', 'ภูมิปัญญา ภูมิสารสนเทศและการบริหารจัดการเพื่อส่งเสริมการท่องเที่ยวเส้นแม่น้ำเจ้าพระยาสายเก่า : รายงานการวิจัย = Local wisdom, geoinformation, and management to promote tourism on the original course of the Cho Phraya River / อารยา เกียรติก้อง ... [และคนอื่นๆ].', 'RE - วิจัย (Research)', 'วิจัย, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0194637', 'b00078203', 'เมฆมิถุนายน : กวีนิพนธ์เพื่อชีวิตและสิ่งแวดล้อม / สวรรค์ แสงบัลลังค์.', 'LI - วรรณกรรม (Literature)', 'วรรณกรรม, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0184802', 'b00078471', 'สามเกลอนักร้องเพลง/ จิตติมา เจริญฤทธิ์.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0228387', 'b00080346', 'การศึกษาประเพณีทำขวัญของจังหวัดพิษณุโลก : รายงานการวิจัย / ทิพย์สุดา นัยทรัพย์.', 'LS - ท้องถิ่นศึกษา (Local Study)', 'ท้องถิ่นศึกษา (ห้องสรรพวิทยาท้องถิ่น), หอสมุดกลาง ชั้น 3 โซน B', 'ดูที่ชั้น'),
('T0227623', 'b00080392', 'สนุกกับโลกของสัตว์.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0227628', 'b00080396', 'ก่อนเข้านอน / กามีย์ ลวซเล, ผู้วาดภาพประกอบ.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0227639', 'b00080480', 'โลกไดโนเสาร์ / Alex Frith ; พีรศักดิ์ ลีลาเชษฐวงศ์, ผู้แปล.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0227537', 'b00080497', 'จิ๊ดกับจิ๋ว หนูน้อยทำได้/ วาสินี ตุงคะเกษตริน ; Oranji Som, ภาพประกอบ.', 'JU - เยาวชน (Children literature)', 'เยาวชน, หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233226', 'b00083209', 'ดอกจานอ่านคำ / ศูนย์วัฒนธรรมการอ่านอีสานบ้านเฮา มหาวิทยาลัยราชภัฏอุดรธานี.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233227', 'b00083429', 'ทำไมต้องเชื่อฟังผู้ใหญ่ / Defelice Misino ; กัญญาณัฐ กรีประเสริฐกุล, แปล.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233228', 'b00083431', 'ต้องฉีดวัคซีนอีกแล้วเหรอ / Defelice Misino ; กัญญาณัฐ กรีประเสริฐกุล, แปล.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233229', 'b00083432', 'ลูกพีชในตะกร้าใบใหญ่ / Defelice Misino ; กัญญาณัฐ กรีประเสริฐกุล, แปล.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233230', 'b00083433', 'ผมอยากได้หมดเลย / Defelice Misino ; กัญญาณัฐ กรีประเสริฐกุล, แปล.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น'),
('T0233231', 'b00083434', 'ฉันทำได้ / Defelice Misino ; กัญญาณัฐ กรีประเสริฐกุล, แปล.', 'JU - เยาวชน (Children literature)', 'หนังสือที่จัดซื้อในปีงบประมาณปัจจุบัน (เยาวชน), หอสมุดกลาง ชั้น 2 โซน A', 'ดูที่ชั้น');

-- --------------------------------------------------------

--
-- Table structure for table `RepairDocs`
--

CREATE TABLE `RepairDocs` (
  `Repair_ID` int NOT NULL,
  `FK_User_ID` int NOT NULL,
  `FK_BookID` varchar(11) NOT NULL,
  `ServiceByName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `RepairDocs`
--

INSERT INTO `RepairDocs` (`Repair_ID`, `FK_User_ID`, `FK_BookID`, `ServiceByName`) VALUES
(30, 2, 'b00003865', 'kongphop'),
(31, 2, 'b00012618', 'ก้องภพ'),
(32, 2, 'b00012690', 'kongphop'),
(33, 2, 'b00003865', 'ก้องภพ'),
(34, 2, 'b00036888', 'อมรรัตน์'),
(35, 2, 'b00080480', 'อมรรัตน์'),
(36, 2, 'b00037922', 'ก้องภพ'),
(37, 2, 'b00058824', 'Kongphop'),
(38, 2, 'b00058378', 'kongphop'),
(39, 2, 'b00057466', 'kong'),
(40, 2, 'b00054461', 'kongphop'),
(41, 2, 'b00054402', 'kong'),
(42, 2, 'b00054361', 'kong'),
(43, 2, 'b00054349', 'kongphp'),
(44, 2, 'b00053323', 'kong'),
(45, 2, 'b00048985', 'kongphop'),
(46, 2, 'b00044262', 'kong'),
(47, 2, 'b00012619', 'หนังสือชำรุด'),
(50, 2, 'b00014818', 'อมรรัตน์'),
(51, 2, 'b00014947', 'อมรรัตน์'),
(52, 2, 'b00015936', 'ก้องภพ'),
(53, 1, 'b00005832', 'อมรรัตน์');

-- --------------------------------------------------------

--
-- Table structure for table `Service`
--

CREATE TABLE `Service` (
  `FK_RepairID` int NOT NULL,
  `Service` varchar(255) NOT NULL,
  `ServiceNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ServiceDate` datetime NOT NULL,
  `FK_UserID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Service`
--

INSERT INTO `Service` (`FK_RepairID`, `Service`, `ServiceNote`, `ServiceDate`, `FK_UserID`) VALUES
(30, 'หนังสือชำรุด', NULL, '2025-02-24 05:13:00', 2),
(31, 'หนังสือชำรุด', NULL, '2025-02-24 06:36:00', 2),
(32, 'หนังสือชำรุด', NULL, '2025-02-24 09:46:00', 2),
(33, 'หนังสือชำรุด', NULL, '2025-02-25 13:45:00', 2),
(34, 'หนังสือชำรุด', NULL, '2025-02-24 14:48:00', 2),
(35, 'หนังสือชำรุด', NULL, '2025-02-20 14:54:00', 2),
(36, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(37, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(38, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(39, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(40, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(41, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(42, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(43, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(44, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(45, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(46, 'หนังสือชำรุด', NULL, '2025-02-26 11:16:00', 2),
(47, 'หนังสือชำรุด', NULL, '2025-02-27 07:46:00', 2),
(50, 'หนังสือชำรุด', NULL, '2025-02-27 07:53:00', 2),
(51, 'หนังสือชำรุด', NULL, '2025-02-27 07:57:00', 2),
(52, 'หนังสือชำรุด', NULL, '2025-02-27 07:57:00', 2),
(53, 'หนังสือชำรุด', NULL, '2025-02-27 09:39:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Status`
--

CREATE TABLE `Status` (
  `FK_RepairID` int NOT NULL,
  `FK_UserID` int NOT NULL,
  `FK_StatusID` int NOT NULL,
  `StatusDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Status`
--

INSERT INTO `Status` (`FK_RepairID`, `FK_UserID`, `FK_StatusID`, `StatusDate`) VALUES
(30, 2, 1, '2025-02-24 05:13:00'),
(30, 2, 2, '2025-02-24 06:02:00'),
(30, 2, 5, '2025-02-24 06:06:53'),
(31, 2, 1, '2025-02-24 06:36:00'),
(31, 2, 1, '2025-02-24 06:37:00'),
(31, 2, 2, '2025-02-24 06:47:00'),
(31, 2, 2, '2025-02-24 06:49:00'),
(31, 2, 1, '2025-02-24 06:51:00'),
(31, 2, 1, '2025-02-24 06:51:00'),
(31, 2, 1, '2025-02-24 13:59:00'),
(31, 2, 1, '2025-02-24 13:59:00'),
(32, 2, 1, '2025-02-24 09:46:00'),
(33, 2, 1, '2025-02-25 13:45:00'),
(33, 2, 1, '2025-02-28 20:46:00'),
(33, 2, 1, '2025-02-28 20:46:00'),
(34, 2, 1, '2025-02-24 14:48:00'),
(34, 2, 2, '2025-02-24 21:51:00'),
(34, 2, 2, '2025-02-24 21:51:00'),
(34, 2, 5, '2025-02-24 14:52:15'),
(35, 2, 1, '2025-02-20 14:54:00'),
(35, 2, 2, '2025-02-24 21:56:00'),
(35, 2, 2, '2025-02-24 21:56:00'),
(35, 2, 5, '2025-02-24 15:00:51'),
(36, 2, 1, '2025-02-26 11:16:00'),
(37, 2, 1, '2025-02-26 11:16:00'),
(38, 2, 1, '2025-02-26 11:16:00'),
(39, 2, 1, '2025-02-26 11:16:00'),
(40, 2, 1, '2025-02-26 11:16:00'),
(41, 2, 1, '2025-02-26 11:16:00'),
(42, 2, 1, '2025-02-26 11:16:00'),
(43, 2, 1, '2025-02-26 11:16:00'),
(44, 2, 1, '2025-02-26 11:16:00'),
(45, 2, 1, '2025-02-26 11:16:00'),
(46, 2, 1, '2025-02-26 11:16:00'),
(47, 2, 1, '2025-02-27 07:46:00'),
(50, 2, 1, '2025-02-27 07:53:00'),
(51, 2, 1, '2025-02-27 07:57:00'),
(52, 2, 1, '2025-02-27 07:57:00'),
(53, 1, 1, '2025-02-27 09:39:00'),
(40, 1, 2, '2025-02-27 16:41:00'),
(40, 1, 2, '2025-02-27 16:41:00'),
(31, 1, 5, '2025-02-27 09:44:01'),
(32, 1, 5, '2025-02-27 09:44:01'),
(40, 1, 5, '2025-02-27 09:44:01');

-- --------------------------------------------------------

--
-- Table structure for table `StatusType`
--

CREATE TABLE `StatusType` (
  `StatusID` int NOT NULL,
  `StatusName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StatusType`
--

INSERT INTO `StatusType` (`StatusID`, `StatusName`) VALUES
(1, 'อยู่ระหว่างการดำเนินการ'),
(2, 'อยู่ระหว่างการซ่อม'),
(3, 'หนังสือหายซื้อเล่มใหม่ทดแทน'),
(4, 'หนังสือหายซื้อเล่มเดิมทดแทน'),
(5, 'ขึ้นชั้น');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `UserAdminID` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Password` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserAdminName` varchar(100) NOT NULL,
  `position_id` int NOT NULL,
  `group_id` int NOT NULL,
  `level_id` int NOT NULL,
  `email` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `UserAdminID`, `Password`, `UserAdminName`, `position_id`, `group_id`, `level_id`, `email`) VALUES
(1, 'Test', '$2b$10$TButoGXsZyqCha1VOry0LODrF/xa9AP1wXE.cWrCgDTMULMm/e8AO', 'นายก้องภพ', 0, 0, 0, ''),
(2, 'Admin', '$2b$10$TButoGXsZyqCha1VOry0LODrF/xa9AP1wXE.cWrCgDTMULMm/e8AO', 'นายAdmin', 0, 0, 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Books`
--
ALTER TABLE `Books`
  ADD PRIMARY KEY (`BookID`);

--
-- Indexes for table `RepairDocs`
--
ALTER TABLE `RepairDocs`
  ADD PRIMARY KEY (`Repair_ID`),
  ADD KEY `ReparUserID` (`FK_User_ID`),
  ADD KEY `RepairBookID` (`FK_BookID`);

--
-- Indexes for table `Service`
--
ALTER TABLE `Service`
  ADD KEY `Service_RepairID` (`FK_RepairID`),
  ADD KEY `ServiceUser_UserID` (`FK_UserID`);

--
-- Indexes for table `Status`
--
ALTER TABLE `Status`
  ADD KEY `StatusTpyeID` (`FK_StatusID`),
  ADD KEY `StatusbyUser` (`FK_UserID`),
  ADD KEY `StatusRepairDocID` (`FK_RepairID`);

--
-- Indexes for table `StatusType`
--
ALTER TABLE `StatusType`
  ADD PRIMARY KEY (`StatusID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Username` (`UserAdminID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `RepairDocs`
--
ALTER TABLE `RepairDocs`
  MODIFY `Repair_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `RepairDocs`
--
ALTER TABLE `RepairDocs`
  ADD CONSTRAINT `RepairBookID` FOREIGN KEY (`FK_BookID`) REFERENCES `Books` (`BookID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `Service`
--
ALTER TABLE `Service`
  ADD CONSTRAINT `Service_RepairID` FOREIGN KEY (`FK_RepairID`) REFERENCES `RepairDocs` (`Repair_ID`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `Status`
--
ALTER TABLE `Status`
  ADD CONSTRAINT `StatusRepairDocID` FOREIGN KEY (`FK_RepairID`) REFERENCES `RepairDocs` (`Repair_ID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `StatusTpyeID` FOREIGN KEY (`FK_StatusID`) REFERENCES `StatusType` (`StatusID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
