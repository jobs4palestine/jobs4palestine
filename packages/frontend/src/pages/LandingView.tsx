import React, { ReactElement } from "react";
import { Button } from "antd";
import "./LandingView.css";
import {
  FaJava,
  FaAndroid,
  FaReact,
  FaNodeJs,
  FaPython,
  FaVuejs,
  FaRobot,
  FaLayerGroup,
  FaHtml5,
  FaPhp,
  FaCode,
} from "react-icons/fa";
import {
  SiAngular,
  SiCodacy,
  SiCsharp, SiDotnet,
  SiFlutter,
  SiIos,
  SiJquery,
  SiRuby,
  SiSpring,
} from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setSpecialty } from "../store/specialtySlice";
import { useNavigate } from "react-router-dom";

import type { Speciality } from "@jobs4palestine/shared";
import { CgCPlusPlus } from "react-icons/cg";

const specialities: { name: Speciality; icon: ReactElement }[] = [
  { name: "Java", icon: <FaJava /> },
  { name: "J2EE", icon: <SiJquery /> },
  { name: "Spring", icon: <SiSpring /> },
  { name: "Android", icon: <FaAndroid /> },
  { name: "iOS", icon: <SiIos /> },
  { name: "React", icon: <FaReact /> },
  { name: "React-Native", icon: <FaReact /> },
  { name: "GoLang", icon: <FaGolang /> },
  { name: "QA (Quality Assurance)", icon: <SiCodacy /> },
  { name: "Python", icon: <FaPython /> },
  { name: "C#", icon: <SiCsharp /> },
  { name: ".NET", icon: <SiDotnet /> },
  { name: "Angular", icon: <SiAngular /> },
  { name: "Ruby", icon: <SiRuby /> },
  { name: "Flutter", icon: <SiFlutter /> },
  { name: "Node.js", icon: <FaNodeJs /> },
  { name: "Vue.JS", icon: <FaVuejs /> },
  { name: "Machine learning", icon: <FaRobot /> },
  { name: "Fullstack", icon: <FaLayerGroup /> },
  { name: "Frontend", icon: <FaHtml5 /> },
  { name: "MatLab", icon: <FaCode /> },
  { name: "PHP", icon: <FaPhp /> },
  { name: "C++", icon: <CgCPlusPlus /> },
];
const LandingView: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = (specialtyName: string) => {
    dispatch(setSpecialty(specialtyName));
    navigate("/table"); // Navigate to TableView
  };

  return (
    <div className="button-cloud-container">
      <div className="button-row">
        {specialities
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((speciality, index) => (
            <Button
              key={index}
              type="primary"
              ghost
              className="floating-button"
              icon={speciality.icon}
              onClick={() => handleButtonClick(speciality.name)}
            >
              {speciality.name}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default LandingView;
