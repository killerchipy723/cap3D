-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-10-2024 a las 23:11:09
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cap3d`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `idalumno` int(11) NOT NULL,
  `apenomb` varchar(500) NOT NULL,
  `dni` int(20) NOT NULL,
  `carrera` varchar(120) NOT NULL,
  `año` int(20) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`idalumno`, `apenomb`, `dni`, `carrera`, `año`, `fecha`) VALUES
(1, 'Sofia Viviana Rojas', 43763233, 'Prof. de Informática', 3, '2024-09-26 20:32:22'),
(2, 'María Magdalena Frias', 40327849, 'Prof. de Informática', 3, '2024-09-26 20:32:31'),
(3, 'Julieta Yasmina Rivadaneyra', 41341193, 'Prof. de Informática', 4, '2024-09-26 20:36:19'),
(4, 'Mariana Belén Lescano ', 41020945, 'Prof. de Informática', 4, '2024-09-26 20:37:07'),
(5, 'Wuscovi, Gabriel Enrique Alberto', 38506286, 'Prof. de Informática', 4, '2024-09-26 20:37:28'),
(6, 'Matias Gonzalez', 32207445, 'Prof. de Informática', 4, '2024-09-26 20:37:39'),
(7, 'Yoseli Dorado', 44176141, 'Prof. de Informática', 4, '2024-09-26 20:37:40'),
(8, 'Luis Gustavo Ibañez', 42080048, 'Prof. de Informática', 3, '2024-09-26 20:38:41'),
(9, 'Diego Alderete', 31840303, 'Prof. de Informática', 3, '2024-09-26 20:40:55'),
(10, 'Lucas Marcelo Dominguez ', 45112120, 'Prof. de Informática', 3, '2024-09-26 20:41:20'),
(11, 'Daniel Lizarraga', 29917613, 'Prof. de Informática', 4, '2024-09-26 20:42:31'),
(12, 'Matías Jesús Fabrício', 44326700, 'Prof. de Informática', 3, '2024-09-26 20:42:32'),
(13, 'Velata Zahira', 44105333, 'Prof. de Informática', 4, '2024-09-26 20:43:39'),
(14, 'Josefina Sapiain', 44271404, 'Prof. de Informática', 4, '2024-09-26 20:51:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `idasistencia` int(11) NOT NULL,
  `idalumno` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `estado` varchar(120) NOT NULL,
  `obs` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`idasistencia`, `idalumno`, `fecha`, `estado`, `obs`) VALUES
(1, 1, '2024-09-26', 'Presente', ''),
(2, 2, '2024-09-26', 'Presente', ''),
(3, 3, '2024-09-26', 'Presente', ''),
(4, 4, '2024-09-26', 'Presente', ''),
(5, 6, '2024-09-26', 'Presente', ''),
(6, 7, '2024-09-26', 'Presente', ''),
(7, 8, '2024-09-26', 'Presente', ''),
(8, 9, '2024-09-26', 'Presente', ''),
(9, 5, '2024-09-26', 'Presente', ''),
(10, 10, '2024-09-26', 'Presente', ''),
(11, 13, '2024-09-26', 'Presente', ''),
(12, 12, '2024-09-26', 'Presente', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`idalumno`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`idasistencia`),
  ADD KEY `idalumno` (`idalumno`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumno`
--
ALTER TABLE `alumno`
  MODIFY `idalumno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `idasistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`idalumno`) REFERENCES `alumno` (`idalumno`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
