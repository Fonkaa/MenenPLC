'use client';

import React, { useState, useRef, useEffect } from 'react';
import OpeningLogoReveal from '@/components/brand/ScrollBoundPyramidBackground';
import { ALL_CLASSIFICATIONS } from '@/components/layout/Navbar';
import FloatingCeoDossier from '@/components/team/FloatingCeoDossier';
import { 
  MapPin, 
  X, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export interface ProjectPlate {
  image?: string;
  caption?: string;
  narrative?: string;
}

export interface DynamicProject {
  id: string;
  slug?: string;
  title: string;
  client?: string;
  category: string;
  location?: string;
  status?: string;
  scopeOfWork?: string;
  description?: string;
  featuredImage?: string;
  galleryImages?: string[] | any;
  descriptionSteps?: ProjectPlate[] | any;
  creativeDirector?: string;
  partnerInCharge?: string;
  projectManager?: string;
  projectTeam?: string;
  mapCoordinates?: string;
}

const INITIAL_42_PROJECTS: DynamicProject[] = [
  {
    id: 'cmupdgh5v000eu4h41etk9awl',
    slug: '4b-g-m-23-mxd-kk-plc',
    title: '4B+G+M+23 MXD Tower',
    client: 'KK PLC',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'UNDER_CONSTRUCTION',
    scopeOfWork: '1st Prize Awarded Schematic Design & Complete Architectural/Engineering Design Services.',
    description: 'A 25-level mixed-use tower providing seamless commercial integration at street level, transitioning into grade-A office suites and panoramic high-rise residential layouts.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008097/menen-engineering/am4bvblsg6leitcejaxw.jpg',
        caption: 'Tower Elevation & Structural Glazing',
        narrative: 'A 25-level mixed-use tower providing seamless commercial integration at street level, transitioning into grade-A office suites and panoramic high-rise residential layouts.'
      },
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791355415/menen-engineering/file_yqwv90.jpg',
        caption: 'Podium & Core Structural Framing',
        narrative: 'Engineered with deep four-basement subterranean parking, shear wall seismic stabilization, and an energy-efficient envelope optimized for natural ventilation.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'MENEN Architectural Studio & Structural Core Team',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgkul000vu4h4985r1h5v',
    slug: 'national-palace-visitors-reception',
    title: 'National Palace Visitors Reception',
    client: 'National Palace Administration / FDRE',
    category: 'Culture',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Historic Conservation Engineering.',
    description: 'A delicate dialogue between monumental Ethiopian civic history and contemporary diplomatic hospitality, respecting original limestone geometry.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791009486/menen-engineering/jcilgfpt5wlmamyhhwxw.jpg',
        caption: 'Front Portico & Civic Welcome Portal',
        narrative: 'A delicate dialogue between monumental Ethiopian civic history and contemporary diplomatic hospitality, respecting original limestone geometry.'
      },
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791358116/menen-engineering/file_u8505u.jpg',
        caption: 'Heritage Vaults & Interior Gallery',
        narrative: 'Restoration of classical proportions with discreet thermal envelopes, seismic retrofitting, and customized VIP circulation arteries.'
      },
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791358126/menen-engineering/file_ttcjyu.jpg',
        caption: 'Garden Colonnade & Courtyard Link',
        narrative: 'Continuous stone colonnades flanking mature indigenous royal gardens, framing visitor sequences with shaded natural light.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Heritage Conservation & Masterplanning Division',
    mapCoordinates: 'National Palace, Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgl1o000wu4h4nkgdcujm',
    slug: 'ics-border-prototypes',
    title: '37 Ethiopian Border Prototype Stations (G+2 STR)',
    client: 'FDRE Immigration & Citizenship Services',
    category: 'Infrastructure',
    location: '37 Ethiopian Border Prototype Sites',
    status: 'BOQ_AND_TENDER',
    scopeOfWork: 'BoQ, Tender Documentation, Full Architectural & Supervision Services.',
    description: 'A robust national border infrastructure design replicable across 37 diverse micro-climates along the borders of Ethiopia.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007845/menen-engineering/djkpcjvrkeqlwswuwklf.jpg',
        caption: 'Modular Prototype Primary Gateway',
        narrative: 'A robust national border infrastructure design replicable across 37 diverse micro-climates along the borders of Ethiopia, prioritizing security and clear processing flows.'
      },
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791357864/menen-engineering/file_cbfyaj.jpg',
        caption: 'Administrative Terminal & Border Inspection Bay',
        narrative: 'Self-sufficient civil engineering incorporating solar power storage, rainwater capture systems, and heavy-duty structural masonry capable of rapid modular deployment.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Eng. Yared Tadesse',
    projectTeam: 'ICS Civil & Security Infrastructure Group',
    mapCoordinates: 'Ethiopian Border Stations, Ethiopia',
  },
  {
    id: 'cmuusnu620003ld1veakdtvk2',
    slug: 'school-6848',
    title: 'Haile Minas Academy & Education Complex',
    client: 'HAILE MINAS ACADEMY',
    category: 'Education',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Construction Supervision.',
    description: 'High-performance pedagogical facilities planned around central learning courtyards that optimize cross-ventilation and natural daylight across all lecture halls.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791177202/menen-engineering/file_nij48w.jpg',
        caption: 'Academic Wing & Communal Spine',
        narrative: 'High-performance pedagogical facilities planned around central learning courtyards that optimize cross-ventilation and natural daylight across all lecture halls.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'MENEN Academic Environments Team',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuutn45k0001fq2dnlyvtr9j',
    slug: 'shiromeda-mall-2444',
    title: 'Shiromeda Commercial Mall',
    client: 'DELIGHT GROUP',
    category: 'Work',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'Multifunctional retail complex responding directly to the bustling commercial fabric of Shiromeda.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791178843/menen-engineering/file_jcyfjs.jpg',
        caption: 'Streetscape Facade & Commercial Atrium',
        narrative: 'Multifunctional retail complex responding directly to the bustling commercial fabric of Shiromeda, combining high shopper throughput with expansive column-free interior retail spaces.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Commercial Retail & Structural Division',
    mapCoordinates: 'Shiromeda, Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgjm5000ou4h4z6zwj0kg',
    slug: 'gb-g-m-17-hsp-jupiter',
    title: 'GB+G+M+17 HSP Landmark Hospitality',
    client: 'Jupiter Trading PLC',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'DESIGN_PERMIT_PROCESS',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'High-rise hospitality development featuring luxury guest suites, conference facilities, and sky lounges with panoramic urban vistas.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007237/menen-engineering/fmgcqs28ujtvown4t8rx.jpg',
        caption: 'Main Tower Elevation',
        narrative: 'High-rise hospitality development featuring luxury guest suites, conference facilities, and sky lounges with panoramic urban vistas.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality & High-Rise Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgjfx000nu4h49w6okn3g',
    slug: '2b-g-m-9-hsp-ayf',
    title: '2B+G+M+9 HSP Luxury Hotel',
    client: 'AYF TRADING PLC',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'Complete Architectural Design Proposed Project.',
    description: 'Nine-story bespoke hospitality architecture combining cultural motifs with modern corporate business hotel specifications.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007167/menen-engineering/fa1sph6ozbsipfavw8ja.jpg',
        caption: 'Boutique Hotel Facade',
        narrative: 'Nine-story bespoke hospitality architecture combining cultural motifs with modern corporate business hotel specifications.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality & Leisure Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdghjf000fu4h4u3eveza3',
    slug: '4b-g-m-20-mxd-kanmax',
    title: '4B+G+M+20 MXD Complex',
    client: 'KANMAX Engineering & Trading PLC',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'LAND_ACQUISITION_PROCESS',
    scopeOfWork: '2nd Prize Awarded Schematic Design & Comprehensive Engineering Review.',
    description: 'Award-winning architectural solution integrating four levels of basement parking with dynamic commercial and residential zoning.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008164/menen-engineering/uf0hwosnw2ay38yyrubq.jpg',
        caption: 'Complex Master Perspective',
        narrative: 'Award-winning architectural solution integrating four levels of basement parking with dynamic commercial and residential zoning.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-Rise Architectural Core',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuusixob0001ld1v2ufxzxhx',
    slug: 'ware-house-8122',
    title: 'Industrial Warehouse Complex',
    client: 'MAZ TRADING PLC',
    category: 'Space',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Large-span clear ceiling logistics design providing heavy vehicle docking, automated loading bays, and administrative space.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791176974/menen-engineering/file_siinn4.jpg',
        caption: 'High-Span Industrial Shed',
        narrative: 'Large-span clear ceiling logistics design providing heavy vehicle docking, automated loading bays, and administrative space.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Eng. Fikadu',
    projectTeam: 'Industrial Space & Logistics Group',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgj1s000lu4h4ghfr0p8f',
    slug: '3b-g-22-bullaleas',
    title: '3B+G+22 Luxury Apartment',
    client: 'BULLALEAS Real Estate PLC',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'FULL Architectural Design Services.',
    description: 'Twenty-two levels of luxury residential suites designed with private terraces, expansive glazing, and dedicated recreational floor plates.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007101/menen-engineering/hd6uidmn6px3vigabuye.jpg',
        caption: 'Tower Elevation & Balcony Profiles',
        narrative: 'Twenty-two levels of luxury residential suites designed with private terraces, expansive glazing, and dedicated recreational floor plates.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-End Residential Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuur1s1000efq2d5ugb3i2q',
    slug: 'b-g-5-residence-5664',
    title: 'B+G+5 Residence',
    client: 'Wro Semeret',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'A bespoke family compound arranged vertically to maximize privacy, natural light, and city views on a compact urban plot in central Addis Ababa.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180706/menen-engineering/file_uqema1.jpg',
        caption: 'Vertical Residential Volume',
        narrative: 'A bespoke family compound arranged vertically to maximize privacy, natural light, and city views on a compact urban plot in central Addis Ababa.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-End Residential Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuv00i0000gfq2dyry0z68g',
    slug: 'b-g-9-4160',
    title: 'B+G+9 Mixed-Use Facility',
    client: 'WRO Selome',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural Review Process.',
    description: 'Urban infill high-density architecture optimizing natural sunlight and commercial storefront visibility.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791181126/menen-engineering/file_c22mi1.jpg',
        caption: 'Corner Elevation View',
        narrative: 'Urban infill high-density architecture optimizing natural sunlight and commercial storefront visibility.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'MENEN Architectural Core',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuu71ym0007fq2dao8beddt',
    slug: '2b-g-19-hst-3033',
    title: '2B+G+19 HST Tower',
    client: 'Asrat - K',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Nineteen-story hospitality building with state-of-the-art HVAC systems and acoustic envelope dampening.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179775/menen-engineering/file_tdrkua.jpg',
        caption: 'Tower Elevation',
        narrative: 'Nineteen-story hospitality building with state-of-the-art HVAC systems and acoustic envelope dampening.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality Design Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgkif000tu4h42v1dvzqz',
    slug: '8-towers-bahir-dar',
    title: '2B+G+15+Terrace (8 Towers Masterplan)',
    client: 'Ato Aleme',
    category: 'Planning',
    location: 'Bahir Dar',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'An eight-tower mixed-use urban community facing Lake Tana with integrated plazas, pedestrian promenades, and civic amenities.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007619/menen-engineering/eka9vpscovgbpas1lvp2.jpg',
        caption: 'Waterfront Masterplan Aerial',
        narrative: 'An eight-tower mixed-use urban community facing Lake Tana with integrated plazas, pedestrian promenades, and civic amenities.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Urban Masterplanning Studio',
    mapCoordinates: 'Bahir Dar, Ethiopia',
  },
  {
    id: 'cmupdghp4000gu4h4zfatj487',
    slug: 'kk-plc-multi-complex',
    title: '2B+G+M+8 APT, B+G+3 RES and G+1 MXD',
    client: 'KK PLC',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'LAND_ACQUISITION_PROCESS',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'A holistic architectural scheme balancing residential villas, multi-family apartments, and streetfront retail.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007032/menen-engineering/mi4s2oohj90ce5z2iwn5.jpg',
        caption: 'Multi-Building Complex Composition',
        narrative: 'A holistic architectural scheme balancing residential villas, multi-family apartments, and streetfront retail.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Multi-Discipline Engineering Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgj7e000mu4h4i7jlsdqu',
    slug: '3b-g-m-23-dyf',
    title: '3B+G+M+23 High-Rise',
    client: 'DYF Real Estate PLC',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'Schematic Architectural Design Proposed Project.',
    description: 'High-performance skyscraper designed with aerodynamic curtain wall paneling and subterranean parking.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007304/menen-engineering/jy4dgvvsdw9xd9msalwo.jpg',
        caption: 'High-Rise Architectural Rendering',
        narrative: 'High-performance skyscraper designed with aerodynamic curtain wall paneling and subterranean parking.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Skyscraper Design Taskforce',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgkna000uu4h4i6oedo0y',
    slug: 'tourism-ministry-interior',
    title: 'FDRE Ministry of Tourism HQ (B+G+10 INT)',
    client: 'FDRE Ministry of Tourism',
    category: 'Interiors',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Interior Design & Supervision Coordination.',
    description: 'Custom millwork, acoustic timber wall paneling, and bespoke lighting fixtures articulating Ethiopian craftsmanship within a modern diplomatic workplace.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007765/menen-engineering/kwurkuwtiyammqduhw6v.jpg',
        caption: 'Ministerial Boardroom & Interior Styling',
        narrative: 'Custom millwork, acoustic timber wall paneling, and bespoke lighting fixtures articulating Ethiopian craftsmanship within a modern diplomatic workplace.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Samiel Musolino',
    projectTeam: 'Ministry of Tourism Design Advisory Taskforce',
    mapCoordinates: 'Bole, Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgi16000hu4h4vvzr9ngd',
    slug: '2b-g-15-apt-gashaw',
    title: '2B+G+15 APT Tower',
    client: 'Ato Gashaw Serigalem',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'DESIGN_PERMIT_PROCESS',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'Contemporary apartment living offering high acoustic isolation, basement parking, and rooftop entertainment.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791006953/menen-engineering/nha180vpnjzcgowhzng3.jpg',
        caption: 'Fifteen-Level Elevation',
        narrative: 'Contemporary apartment living offering high acoustic isolation, basement parking, and rooftop entertainment.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Residential High-Rise Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuusg4iu0000ld1v71yeiexu',
    slug: 'ware-house-7025',
    title: 'PRIME Logistics & Warehousing Hub',
    client: 'PRIME PACKAGING',
    category: 'Space',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Engineered with long-span steel trusses and heavy-duty industrial floor slabs designed to handle high-frequency logistics transport and automated packaging machinery.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791176840/menen-engineering/file_oviwwx.jpg',
        caption: 'High-Clearance Logistics Bay',
        narrative: 'Engineered with long-span steel trusses and heavy-duty industrial floor slabs designed to handle high-frequency logistics transport and automated packaging machinery.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Eng. Fikadu',
    projectTeam: 'Industrial Space & Logistics Group',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgkdi000su4h4pk1w80qt',
    slug: 'ketema-kebede-residence-landscape',
    title: '2B+G+4 RES with 3,500 Sqm Landscape',
    client: 'Ato Ketema Kebede',
    category: 'Landscape',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Landscape Design Services.',
    description: 'Extensive grading and water stewardship integration connecting indoor living zones directly to outdoor terraced gardens, stone pathways, and meditation pavilions.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791007470/menen-engineering/nbucizol8gokd3wuhce7.jpg',
        caption: 'Terraced Water Features & Indigenous Plant Palette',
        narrative: 'Extensive grading and water stewardship integration connecting indoor living zones directly to outdoor terraced gardens, stone pathways, and meditation pavilions.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Environmental & Topographical Planning Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuusly1r0002ld1vsax1xw1r',
    slug: 'indoor-court-8290',
    title: 'Lycée G/M Indoor Covered Arena',
    client: 'LYCÉE G/M',
    category: 'Sports',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Structural Design, Long-Span Steel Framing & Supervision.',
    description: 'A column-free indoor multi-sport arena engineered with custom structural steel trusses, acoustic dampening wall assemblies, and professional sprung hardwood court systems.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791177113/menen-engineering/file_jfuplp.jpg',
        caption: 'Main Athletic Enclosure & Tension Roof',
        narrative: 'A column-free indoor multi-sport arena engineered with custom structural steel trusses, acoustic dampening wall assemblies, and professional sprung hardwood court systems.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Eng. Habtamu Getu',
    projectTeam: 'Specialized Long-Span Structural Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupe7mam000qu4ok0ngyl268',
    slug: 'grand-central-arba-minch-hotel',
    title: 'Grand Central Arba Minch Hotel',
    client: 'GRAND CENTRAL ARBA MINCH HOTEL',
    category: 'Hospitality',
    location: 'Arba Minch',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'Complete Architectural & Engineering Design Services (2B+G+M+4 HSP, B+G+1 RES).',
    description: 'A hospitality destination capturing views across Lake Abaya and Chamo, blending indigenous Rift Valley stone textures with international resort luxury.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791009099/menen-engineering/zmwg6yi4kkzxjrwhjrvx.jpg',
        caption: 'Resort Terraces & Panoramic Valley Vista',
        narrative: 'A hospitality destination capturing views across Lake Abaya and Chamo, blending indigenous Rift Valley stone textures with international resort luxury.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality & Leisure Studio',
    mapCoordinates: 'Arba Minch, Ethiopia',
  },
  {
    id: 'cmupdgk84000ru4h4ycjezrqb',
    slug: 'royal-hotel-bonga',
    title: 'Royal Hotel Bonga (1B+G+M+8 HSP)',
    client: 'ROYAL HOTEL',
    category: 'Hospitality',
    location: 'Bonga',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'Eight-story premium hotel in Bonga offering executive hospitality services and modern structural design.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791009166/menen-engineering/efinuas8twqfan1oskhj.jpg',
        caption: 'Hotel Elevation',
        narrative: 'Eight-story hospitality hub in Keffa coffee origin territory, designed to provide eco-tourist amenities.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality Engineering Team',
    mapCoordinates: 'Bonga, Ethiopia',
  },
  {
    id: 'cmuut33rc0005ld1v8w5q0kzc',
    slug: 'g-2-edu-9117',
    title: 'G+2 Educational Facility',
    client: 'Ethiopian Catholic Church Jimma',
    category: 'Education',
    location: 'Jimma',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design Services.',
    description: 'Classroom facility designed with wide solar shading fins, modular partition abilities, and robust concrete frames.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791177914/menen-engineering/file_uefztc.jpg',
        caption: 'Educational Block Facade',
        narrative: 'Classroom facility designed with wide solar shading fins, modular partition abilities, and robust concrete frames.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'MENEN Academic Environments Team',
    mapCoordinates: 'Jimma, Ethiopia',
  },
  {
    id: 'cmuut18640004ld1vuty4o70b',
    slug: 'g-1-1220',
    title: 'G+1 Regional Administrative Hub',
    client: 'FDRE Ministry of Education',
    category: 'Education',
    location: 'Sekota',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Regional educational service center built with thermal massing concrete and stone masonry.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791177827/menen-engineering/file_pyasfs.jpg',
        caption: 'Facility Elevation',
        narrative: 'Regional educational service center built with thermal massing concrete and stone masonry.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Public Educational Works Team',
    mapCoordinates: 'Sekota, Ethiopia',
  },
  {
    id: 'cmuuud73s0009fq2dwx5x4iz0',
    slug: '4b-sb-g-30-mxd-9632',
    title: '4B + SB+G 30 MXD Monument',
    client: 'YERABA',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: '2nd Prize Awarded Design Proposed Project.',
    description: 'Thirty-story architectural monument featuring four basements and semi-basement commercial centers.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180062/menen-engineering/file_ltut6z.jpg',
        caption: 'Tower Podium and Superstructure',
        narrative: 'Thirty-story architectural monument featuring four basements and semi-basement commercial centers.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-Rise Architectural Core',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuu4ear0006fq2d0ni34pha',
    slug: '2b-g-19-mxd-9058',
    title: '2B+G+19 Commercial Center',
    client: 'Soliana Trading PLC',
    category: 'Work',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Nineteen-story commercial workplace emphasizing corporate atrium visibility and seismic stability.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179655/menen-engineering/file_dheilz.jpg',
        caption: 'Curved Glass Elevation',
        narrative: 'Nineteen-story commercial workplace emphasizing corporate atrium visibility and seismic stability.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Corporate Architecture Group',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuu9lns0008fq2dgwob3mxl',
    slug: 'b-g-9-apartment-1879',
    title: 'B+G+9 Apartment Complex',
    client: 'SNDF',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Design Renovation Services.',
    description: 'Modern residential renovation retrofitting high thermal efficiency and open-plan interior units.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179897/menen-engineering/file_uf5fqm.jpg',
        caption: 'Residential Facade',
        narrative: 'Modern residential renovation retrofitting high thermal efficiency and open-plan interior units.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Residential Modernization Division',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuutqf2j0002fq2dzbx86mah',
    slug: 'interior-design-6873',
    title: 'Corporate Headquarters Interior',
    client: 'Yegna Trading Plc',
    category: 'Interiors',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Interior Design and Supervision.',
    description: 'Luxury workplace detailing with bespoke executive timber joinery and concealed acoustic paneling.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791178998/menen-engineering/file_dzb876.jpg',
        caption: 'Executive Suite Interior',
        narrative: 'Luxury workplace detailing with bespoke executive timber joinery and concealed acoustic paneling.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Samiel Musolino',
    projectTeam: 'Interior Architecture Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuukrru000cfq2d11i39fek',
    slug: 'b-g-3r-es-2725',
    title: 'B+G+3 Residential Villa',
    client: 'Ato Brook Getachew',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural Review Design Services.',
    description: 'Private multi-level family estate integrating double-height living areas with stone terrace gardens.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180414/menen-engineering/file_sxskpr.jpg',
        caption: 'Villa Front Elevation',
        narrative: 'Private multi-level family estate integrating double-height living areas with stone terrace gardens.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-End Residential Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuunfje000dfq2dcnzcglet',
    slug: '2b-g-m-4-hsp-b-g-1-res-7125',
    title: '2B+G+M+4 HSP, B+G+1 RES Complex',
    client: 'ATO GETACHEW',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'Integrated compound featuring boutique hotel facilities coupled with a discreet private residence.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180534/menen-engineering/file_ezguij.jpg',
        caption: 'Hospitality & Private Villa Link',
        narrative: 'Integrated compound featuring boutique hotel facilities coupled with a discreet private residence.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Mixed Development Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuuh5tm000bfq2dk8ewoh00',
    slug: 'g-16-4601',
    title: 'G + 16 Structural Tower',
    client: 'Professor Berehanu',
    category: 'Architecture',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Structural Design & Stability Analysis.',
    description: 'Sixteen-story structural frame engineered to European and local seismic code specifications.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180240/menen-engineering/file_k9ioov.jpg',
        caption: 'High-Rise Structural Modeling',
        narrative: 'Sixteen-story structural frame engineered to European and local seismic code specifications.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Eng. Habtamu Getu',
    projectTeam: 'Structural Dynamics Taskforce',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuufel2000afq2d1qfzjgdq',
    slug: 'b-g-8-apartment-2646',
    title: 'B+G+8 Apartment Building',
    client: 'ENE Ato Moges',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services with Supervision.',
    description: 'Eight-story urban apartment structure providing optimized natural ventilation and efficient multi-unit floorplans.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791180167/menen-engineering/file_hmqqea.jpg',
        caption: 'Apartment Street Profile',
        narrative: 'Eight-story urban apartment structure providing optimized natural ventilation and efficient multi-unit floorplans.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Urban Housing Team',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuutyjcs0004fq2dvqoyxuzx',
    slug: 'g-17apartment-5675',
    title: 'G + 17 Apartment Tower',
    client: 'MULTIPLE OWNERS',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design and Construction Supervision.',
    description: 'High-density multi-ownership tower offering panoramic vistas across Addis Ababa with basement parking.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179380/menen-engineering/file_kesak6.jpg',
        caption: 'Seventeen-Level Tower',
        narrative: 'High-density multi-ownership tower offering panoramic vistas across Addis Ababa with basement parking.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Residential High-Rise Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuutvgac0003fq2dvpg0nait',
    slug: 'immigration-and-citizenship-services-1463',
    title: 'Immigration & Citizenship Headquarters Interior',
    client: 'Immigration and Citizenship Services',
    category: 'Interiors',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Interior Design and Supervision Coordination.',
    description: 'High-volume civic interior layout designed for secure processing flows, acoustic clarity, and durability.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179233/menen-engineering/file_abrtuq.jpg',
        caption: 'Public Hall & Counter Architecture',
        narrative: 'High-volume civic interior layout designed for secure processing flows, acoustic clarity, and durability.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Samiel Musolino',
    projectTeam: 'Civic Interiors Division',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuuu19oa0005fq2d27yxp1j5',
    slug: '2b-g-12mxd-3094',
    title: '2B+G+12 MXD Complex',
    client: 'MULTIPLE OWNERS',
    category: 'Architecture',
    location: 'Addis Ababa, Kazanchis',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design & Supervision Services.',
    description: 'Twelve-story architectural solution designed for high density in the central business hub of Kazanchis.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791179502/menen-engineering/file_cqtuyi.jpg',
        caption: 'Kazanchis Commercial Street Elevation',
        narrative: 'Twelve-story architectural solution designed for high density in the central business hub of Kazanchis.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'MENEN Architectural Core',
    mapCoordinates: 'Kazanchis, Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgikb000iu4h4cwevo8h8',
    slug: '2b-g-13-dr-birhanu',
    title: '2B+G+13 Residential Tower',
    client: 'Dr. Birhanu',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'DESIGN_PERMIT_PROCESS',
    scopeOfWork: 'Complete Architectural & Engineering Design Services (Permit Process Completed).',
    description: 'Modern residential tower with two-level underground parking and modular unit partitions.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008360/menen-engineering/haq3r343efvxitua7f6k.jpg',
        caption: 'Thirteen-Story Residential Elevation',
        narrative: 'Modern residential tower with two-level underground parking and modular unit partitions.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Residential Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgiph000ju4h4m8w0zwon',
    slug: 'joburg-real-estate-abraham',
    title: 'Joburg Real Estate Residential & Interior Package',
    client: 'Joburg Real Estate | Ato Abraham',
    category: 'Interiors',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural Review and Interior Design Package.',
    description: 'Turnkey interior architecture featuring luxury finishing selections, custom lighting, and bespoke joinery.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008444/menen-engineering/apysq5umqqtpr1kpehqr.jpg',
        caption: 'Interior Living & Penthouse Detailing',
        narrative: 'Turnkey interior architecture featuring luxury finishing selections, custom lighting, and bespoke joinery.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Samiel Musolino',
    projectTeam: 'Interior Architecture Studio',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgiuq000ku4h4ahsy0ybm',
    slug: 'b-g-m-15-apt-elias-hilawi',
    title: 'B+G+M+15 APT Tower',
    client: 'Ato Elias | Ato Hilawi',
    category: 'Residential',
    location: 'Addis Ababa',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'Complete Architectural & Engineering Design Services.',
    description: 'High-density apartment building incorporating mezzanine commercial levels and rooftop terraces.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008516/menen-engineering/uv5khcysruhidztzctbo.jpg',
        caption: 'Fifteen-Level Tower Elevation',
        narrative: 'High-density apartment building incorporating mezzanine commercial levels and rooftop terraces.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'High-Rise Residential Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupe7lto000nu4ok6tf0qxw0',
    slug: '2b-g-m-9-hsp-ayf-trading',
    title: '2B+G+M+9 HSP Boutique Hotel',
    client: 'AYF TRADING PLC',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'DESIGN_PHASE',
    scopeOfWork: 'Complete Architectural Design Proposed Project.',
    description: 'Modern boutique hotel design with mezzanine restaurant levels and guest lounges.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008696/menen-engineering/pogm6aey2y7ogwfp1kuq.jpg',
        caption: 'Hotel Front Perspective',
        narrative: 'Modern boutique hotel design with mezzanine restaurant levels and guest lounges.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality Design Unit',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmupdgjr2000pu4h4ppkoloc6',
    slug: '2b-g-12-hsp-getachew',
    title: '2B+G+12 HSP Suites & Hotel',
    client: 'Ato Getachew',
    category: 'Hospitality',
    location: 'Addis Ababa',
    status: 'COMPLETED',
    scopeOfWork: 'Complete Architectural & Engineering Design Services & Construction Supervision.',
    description: 'Comprehensive design and on-site supervision for a luxury suites hotel completed to international standards.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791008995/menen-engineering/zanpqwgiysfgfivlprxb.jpg',
        caption: 'Twelve-Level Hospitality Tower',
        narrative: 'Comprehensive design and on-site supervision for a luxury suites hotel completed to international standards.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Hospitality Engineering Team',
    mapCoordinates: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'cmuutl5d80000fq2doqt6xhu7',
    slug: 'git-push-origin-main-0981',
    title: 'Jimma Catholic Community Center & Health Unit',
    client: 'Ethiopian Catholic Church Jimma',
    category: 'Health',
    location: 'Jimma',
    status: 'COMPLETED',
    scopeOfWork: 'FULL Architectural Design Services.',
    description: 'Multi-purpose diagnostic and community wellness building providing hygiene and outpatient access.',
    descriptionSteps: [
      {
        image: 'https://res.cloudinary.com/nytwathq/image/upload/v1791178756/menen-engineering/file_w9byb8.jpg',
        caption: 'Community Health Block',
        narrative: 'Multi-purpose diagnostic and community wellness building providing hygiene and outpatient access.'
      }
    ],
    creativeDirector: 'Arch. Samiel Musolino',
    partnerInCharge: 'Eng. Habtamu Getu',
    projectManager: 'Arch. Ephrem',
    projectTeam: 'Community Architecture Studio',
    mapCoordinates: 'Jimma, Ethiopia',
  }
];

function resolveDynamicPlates(project: DynamicProject): ProjectPlate[] {
  if (Array.isArray(project.descriptionSteps) && project.descriptionSteps.length > 0) {
    return project.descriptionSteps.map((step: any, idx: number) => ({
      image: typeof step === 'string' ? step : step.imageUrl || step.image || '',
      caption: step.caption || `${project.title} · Plate 0${idx + 1}`,
      narrative: step.narrative || step.description || step.text || ''
    }));
  }

  if (Array.isArray(project.galleryImages) && project.galleryImages.length > 0) {
    return project.galleryImages.map((img: string, idx: number) => ({
      image: img,
      caption: `${project.title} · Perspective 0${idx + 1}`,
      narrative: project.description || project.scopeOfWork || ''
    }));
  }

  return [
    {
      image: project.featuredImage || 'https://res.cloudinary.com/nytwathq/image/upload/v1791008097/menen-engineering/am4bvblsg6leitcejaxw.jpg',
      caption: project.title,
      narrative: project.description || project.scopeOfWork || ''
    }
  ];
}

const MOTION_CSS = `
@keyframes menenStepByStep25 {
  0% { transform: scale(0.78); opacity: 0.35; }
  35% { transform: scale(0.86); opacity: 0.65; }
  70% { transform: scale(0.94); opacity: 0.88; }
  100% { transform: scale(1); opacity: 1; }
}

.menen-luxury-open {
  animation: menenStepByStep25 2.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: center center;
  will-change: transform, opacity;
}

/* Strictly enforce sharp rectangular borders ONLY on project image thumbs and monograph visuals */
.project-card-thumb,
.project-card-thumb img,
.monograph-image,
.monograph-image img {
  border-radius: 0px !important;
}
`;

export default function HomePage() {
  const [projectsList, setProjectsList] = useState<DynamicProject[]>(INITIAL_42_PROJECTS);
  const [classificationsList, setClassificationsList] = useState<string[]>([...ALL_CLASSIFICATIONS]);
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(new Set());
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    async function fetchLiveSiteData() {
      try {
        const fetchOpts: RequestInit = {
          cache: 'no-store',
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
        };

        const [projRes, confRes] = await Promise.all([
          fetch('/api/admin/projects', fetchOpts),
          fetch('/api/admin/config', fetchOpts),
        ]);

        if (projRes.ok) {
          const liveProjects = await projRes.json();
          if (Array.isArray(liveProjects) && liveProjects.length > 0) {
            setProjectsList(liveProjects);
          }
        }

        if (confRes.ok) {
          const conf = await confRes.json();
          if (conf?.classifications && Array.isArray(conf.classifications) && conf.classifications.length > 0) {
            setClassificationsList(conf.classifications);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic database items, using seed state:', err);
      }
    }

    fetchLiveSiteData();
  }, []);

  useEffect(() => {
    const handleCategoryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const cat = customEvent.detail || '';
      if (!cat) return;
      const target = document.getElementById(`classification-${cat.toLowerCase().trim()}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail || '');
    };

    window.addEventListener('classification-select', handleCategoryEvent);
    window.addEventListener('classification-search', handleSearchEvent);

    return () => {
      window.removeEventListener('classification-select', handleCategoryEvent);
      window.removeEventListener('classification-search', handleSearchEvent);
    };
  }, []);

  const handleOpenProject = (id: string) => {
    setHoveredProjectId(null);
    setExpandedProjectIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleCloseProject = (id: string) => {
    setExpandedProjectIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleScrollSide = (projectId: string, direction: 'left' | 'right') => {
    const el = scrollContainerRefs.current[projectId];
    if (el) {
      const scrollAmount = window.innerWidth * 0.9;
      el.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const activeDisciplines = classificationsList.filter((d) =>
    d.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <main className="bg-white text-neutral-900 min-h-screen selection:bg-neutral-950 selection:text-white font-sans antialiased w-full relative">
      <style>{MOTION_CSS}</style>
      <OpeningLogoReveal />

      <section id="projects-archive" className="w-full py-2 sm:py-3 space-y-3 sm:space-y-4 text-center scroll-mt-20">
        {activeDisciplines.length === 0 && (
          <article className="py-12 space-y-2 font-mono text-center">
            <AlertCircle className="w-5 h-5 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-neutral-950">
              There is no such classification
            </h3>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest">
              Please search within our recognized architectural disciplines.
            </p>
          </article>
        )}

        {activeDisciplines.map((discipline) => {
          const matchedProjects = projectsList.filter(
            (p) => p.category.toLowerCase() === discipline.toLowerCase()
          );

          if (matchedProjects.length === 0) return null;

          return (
            <section
              key={discipline}
              id={`classification-${discipline.toLowerCase()}`}
              className="scroll-mt-20 space-y-2 flex flex-col items-center w-full"
            >
              <header className="w-full max-w-4xl px-4 space-y-1 text-center">
                <nav className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400 whitespace-nowrap">
                    {String(matchedProjects.length).padStart(2, '0')} {matchedProjects.length === 1 ? 'Volume' : 'Volumes'}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200" />
                </nav>
                <h2 className="text-lg sm:text-2xl font-serif font-black tracking-[-0.02em] text-neutral-950 uppercase leading-none">
                  {discipline}
                </h2>
              </header>

              <section className="w-full space-y-2 flex flex-col items-center">
                {matchedProjects.map((item) => {
                  const isExpanded = expandedProjectIds.has(item.id);
                  const isHovered = hoveredProjectId === item.id;
                  const hasHoverActive = hoveredProjectId !== null;

                  const plates = resolveDynamicPlates(item);
                  const heroThumbnail = plates[0]?.image || '/images/menen-logo-original-colors.png';
                  const displayDesc = item.description || plates[0]?.narrative || item.scopeOfWork || '';

                  return (
                    <article 
                      key={item.id} 
                      id={`project-${item.id}`}
                      className="w-full flex flex-col items-center relative scroll-mt-20"
                    >
                      {!isExpanded ? (
                        <button
                          type="button"
                          aria-label={`Open ${item.title}`}
                          onClick={() => handleOpenProject(item.id)}
                          onMouseEnter={() => setHoveredProjectId(item.id)}
                          onMouseLeave={() => setHoveredProjectId(null)}
                          className={`w-full max-w-[240px] sm:max-w-sm mx-auto px-1.5 py-1 flex flex-col items-center cursor-pointer group space-y-1.5 text-center outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                            isHovered 
                              ? 'scale-[1.06] z-20' 
                              : hasHoverActive 
                                ? 'scale-[0.84] opacity-80' 
                                : 'scale-100 opacity-100'
                          }`}
                        >
                          <figure className="project-card-thumb relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.28)] m-0">
                            <img
                              src={heroThumbnail}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover contrast-105 transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-700" />
                            {item.status && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/95 font-mono text-[7px] uppercase tracking-[0.16em] font-semibold text-neutral-900 shadow-xs rounded-sm">
                                {item.status.replace(/_/g, ' ')}
                              </span>
                            )}
                          </figure>

                          <footer className="space-y-1 px-1 text-center w-full">
                            <h3 className="text-xs sm:text-sm font-serif font-bold tracking-tight text-neutral-950 group-hover:text-black transition-colors leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                              {item.location || 'Addis Ababa'}
                              {item.client && ` • Client: ${item.client}`}
                            </p>

                            {displayDesc && (
                              <p className="text-[10px] sm:text-[11px] font-serif italic text-neutral-600 line-clamp-2 max-w-xs mx-auto leading-tight mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                &ldquo;{displayDesc}&rdquo;
                              </p>
                            )}
                          </footer>
                        </button>
                      ) : (
                        <section className="menen-luxury-open w-full max-w-[96vw] xl:max-w-[94vw] mx-auto py-2 space-y-3">
                          <header className="w-full px-4 sm:px-8 flex items-end justify-between gap-4 border-b border-neutral-100 pb-2 text-left">
                            <hgroup className="min-w-0">
                              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-0.5">
                                {item.category} • {item.location || 'Ethiopia'}
                              </span>
                              <h3 className="text-2xl sm:text-4xl font-serif font-black tracking-[-0.02em] text-neutral-950 leading-tight truncate">
                                {item.title}
                              </h3>
                            </hgroup>

                            <nav className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleScrollSide(item.id, 'left')}
                                className="p-2 sm:p-2.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-all duration-300 cursor-pointer shadow-sm rounded-xl"
                                aria-label="Previous Page"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleScrollSide(item.id, 'right')}
                                className="p-2 sm:p-2.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-all duration-300 cursor-pointer shadow-sm rounded-xl"
                                aria-label="Next Page"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCloseProject(item.id)}
                                className="p-2 sm:p-2.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 cursor-pointer shadow-md rounded-xl"
                                aria-label="Close Project"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </nav>
                          </header>

                          {/* Dynamic Monograph Container */}
                          <section
                            ref={(el) => {
                              scrollContainerRefs.current[item.id] = el;
                            }}
                            className="flex items-center gap-8 sm:gap-12 overflow-x-auto px-4 sm:px-8 py-2 pb-4 scroll-smooth w-full no-scrollbar snap-x snap-mandatory"
                          >
                            {plates.map((plate, plateIdx) => {
                              const hasImg = Boolean(plate.image && plate.image.trim() !== '');
                              const hasText = Boolean(plate.narrative && plate.narrative.trim() !== '');
                              const textLength = (plate.narrative || '').length;

                              const dynamicSideWidth = textLength > 350
                                ? 'w-[520px] sm:w-[680px] lg:w-[760px]'
                                : textLength > 180
                                ? 'w-[420px] sm:w-[540px]'
                                : 'w-[320px] sm:w-[420px]';

                              return (
                                <article
                                  key={plateIdx}
                                  className="shrink-0 flex flex-row items-center gap-6 sm:gap-10 text-left snap-center h-full max-h-[85vh]"
                                >
                                  {hasImg && (
                                    <figure className="monograph-image m-0 shrink-0 h-[48vh] sm:h-[58vh] max-h-[580px] aspect-[16/10] bg-neutral-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] overflow-hidden">
                                      <img
                                        src={plate.image}
                                        alt={plate.caption || item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </figure>
                                  )}

                                  {(hasText || plate.caption) && (
                                    <article className={`shrink-0 flex flex-col justify-center space-y-3 ${hasImg ? dynamicSideWidth : 'w-[520px] sm:w-[720px]'}`}>
                                      {plate.caption && (
                                        <h4 className="text-lg sm:text-2xl font-serif font-black tracking-[-0.015em] text-neutral-950 leading-tight">
                                          {plate.caption}
                                        </h4>
                                      )}

                                      {hasText && (
                                        <p
                                          className={`text-sm sm:text-base font-serif text-neutral-700 leading-relaxed m-0 text-justify ${
                                            textLength > 300 ? 'columns-1 sm:columns-2 gap-6' : ''
                                          }`}
                                        >
                                          {plate.narrative}
                                        </p>
                                      )}

                                      {item.scopeOfWork && plateIdx === 0 && (
                                        <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 pt-1">
                                          Commission: {item.scopeOfWork}
                                        </p>
                                      )}
                                    </article>
                                  )}
                                </article>
                              );
                            })}

                            {/* Map & Spatial Coordinates Card (Increased size on mobile & desktop) */}
                            <article className="shrink-0 flex flex-row items-center gap-6 sm:gap-10 text-left snap-center h-full max-h-[85vh]">
                              <figure className="m-0 shrink-0 h-[62vh] sm:h-[68vh] max-h-[680px] w-[85vw] sm:w-[580px] lg:w-[680px] aspect-[16/11] flex flex-col space-y-2 rounded-2xl overflow-hidden bg-neutral-100 p-2.5 shadow-md">
                                <figcaption className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-600 px-1">
                                  <span className="flex items-center gap-1.5 text-neutral-950 font-bold">
                                    <MapPin className="w-4 h-4 text-neutral-900" /> Spatial Coordinates
                                  </span>
                                  <span>{item.mapCoordinates || item.location || 'Addis Ababa, Ethiopia'}</span>
                                </figcaption>
                                <iframe
                                  title="Project Map"
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  scrolling="no"
                                  loading="lazy"
                                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                    item.mapCoordinates || item.location || 'Addis Ababa, Ethiopia'
                                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                  className="w-full flex-1 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.3)] filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700 rounded-xl"
                                />
                              </figure>

                              {/* Leadership & Monograph Details */}
                              <article className="w-[320px] sm:w-[400px] shrink-0 space-y-4">
                                <h4 className="font-mono text-xs uppercase tracking-[0.25em] font-bold text-neutral-950 pb-1.5 border-b border-neutral-100">
                                  Project Leadership &amp; Credits
                                </h4>
                                
                                <dl className="grid grid-cols-2 gap-3 font-mono m-0">
                                  {[
                                    ['Creative Director', item.creativeDirector || 'Arch. Samiel Musolino'],
                                    ['Partner In Charge', item.partnerInCharge || 'Eng. Habtamu Getu'],
                                    ['Project Manager', item.projectManager || 'Arch. Ephrem'],
                                    ['Project Team', item.projectTeam || 'MENEN Studio'],
                                  ].map(([label, value]) => (
                                    <section key={label} className="border-b border-neutral-100 pb-1.5">
                                      <dt className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                                        {label}
                                      </dt>
                                      <dd className="text-xs font-bold text-neutral-950 font-serif m-0 mt-0.5">
                                        {value}
                                      </dd>
                                    </section>
                                  ))}
                                </dl>

                                <button
                                  type="button"
                                  onClick={() => handleCloseProject(item.id)}
                                  className="w-full py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors font-mono text-xs uppercase tracking-[0.2em] cursor-pointer shadow-md rounded-xl"
                                >
                                  Close Monograph &uarr;
                                </button>
                              </article>
                            </article>
                          </section>
                        </section>
                      )}
                    </article>
                  );
                })}
              </section>
            </section>
          );
        })}
      </section>
      <FloatingCeoDossier />
    </main>
  );
}