import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import PageTransition from "./components/PageTransition.jsx";
import HeroBackground from "./components/HeroBackground.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import TrustBar from "./components/TrustBar.jsx";
import ProductCatalogPage from "./pages/ProductCatalogPage.jsx";
import { useDocumentTitle } from "./hooks/useDocumentTitle.js";

const content = {
  en: {
    langCode: "en",
    nav: {
      products: "Products",
      catalog: "Catalog",
      ranges: "Selection Guide",
      featured: "Featured",
      hybridSeries: "Hybrid Series Data",
      about: "About",
      certifications: "Certifications",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu"
    },
    hero: {
      eyebrow: "Industrial Electronics Supplier",
      title: "Modern components. Proven reliability.",
      body: "JODO provides high-reliability electronic components and engineering support for demanding industries.",
      primaryBtn: "Request a Quote",
      secondaryBtn: "Explore Products",
      visualTags: ["Aerospace", "Satellite", "Space-grade components"]
    },
    trust: {
      ariaLabel: "Company credentials",
      parts: "Part numbers in catalog",
      categories: "Product categories",
      cert: "Quality standard",
      certValue: "GJB9001B",
      industry: "Core applications",
      industryValue: "Aerospace"
    },
    meta: {
      default: {
        title: "Industrial Components",
        description:
          "JODO high-reliability electronic components for aerospace, defense, and industrial applications."
      },
      products: {
        title: "Products",
        description: "Explore JODO core capacitor product lines and engineering capabilities."
      },
      catalog: {
        title: "Product Catalog",
        description: "Browse and search JODO part numbers from the live MDB catalog."
      },
      ranges: {
        title: "Selection Guide",
        description: "Capacitance and voltage selection ranges for JODO components."
      },
      featured: {
        title: "Featured Series",
        description: "Highlighted JODO product series and specifications."
      },
      hybridSeries: {
        title: "Hybrid Series",
        description: "High-energy hybrid capacitor series data and specifications."
      },
      about: {
        title: "About JODO",
        description: "About Shanghai JODO Industry Co., Ltd., partnerships, history, and one-stop service."
      },
      certifications: {
        title: "Certifications",
        description: "JODO quality standards and certifications."
      },
      contact: {
        title: "Contact",
        description: "Contact JODO for quotes and engineering support."
      }
    },
    sections: {
      products: "Core Product Lines",
      ranges: "Capacitance & Voltage Selection",
      featured: "THQ Series Highlights",
      hybridSeries: "High-Energy Hybrid Capacitor Series",
      about: "About JODO",
      certifications: "Quality & Certifications",
      contact: "Contact JODO"
    },
    aboutPage: {
      goal: "JODO's goal is to deliver products at the highest world-class standard.",
      overview: [
        "With a customer-centric development strategy, JODO uses a broad domestic and international marketing network to respond quickly and provide one-stop service.",
        "R&D capability is a core competitiveness. Shanghai JODO Industry Co., Ltd. is a strategic pillar for Evans and Admat worldwide, contributing to local development and participating in global projects with these partners.",
        "By combining local strengths with international resources, JODO aims to deliver tailored solutions for customers, returns for shareholders, and opportunities for employees—and to become an outstanding enterprise in China's electronics industry."
      ],
      historyTitle: "Our History",
      history: [
        "Founded in 2004 as Shanghai JODO Industry Co., Ltd., JODO began as the agent for Evans tantalum capacitors and is responsible for promotion and sales across mainland China.",
        "JODO components are used in industrial, computer, automotive, consumer, communications, aviation, and medical electronics."
      ],
      innovationTitle: "Growth Through Innovation and Partnership",
      innovation: [
        "We push the limits of miniaturization and high performance.",
        "EVANS and ADMAT are technology leaders and among the world's most advanced manufacturers of passive components."
      ],
      serviceTitle: "One-Stop Service",
      service: [
        "Customers can provide a bill of materials (BOM); JODO matches it to our product range so procurement can be consolidated with a single supplier.",
        "We also offer free product samples to design engineers worldwide. Learn more at www.jodo.com.cn.",
        "Our line spans specialty and general-purpose parts—including resistors, capacitors, inductors, sensors, and related filters—supported by service, innovation, quality, and cost control."
      ],
      contactTitle: "Contact Us",
      certificationsTitle: "Quality & Certifications"
    },
    certifications: [
      "ISO 9000 quality process",
      "GJB9001B-2009 compliance",
      "High reliability standards"
    ],
    contact: {
      email: "Email: sales@jodo.com.cn",
      website: "Website: www.jodo.com.cn"
    },
    search: {
      placeholder: "Search part number, category, or series...",
      button: "Search",
      heroHint:
        "Search by part number, product category (e.g. solid tantalum), or model series."
    },
    catalog: {
      title: "Product Catalog",
      intro:
        "Browse product families and search part numbers in one place, powered by the live MDB catalog.",
      categories: "Categories",
      models: "models",
      modelCount: "Model series",
      partCount: "Available parts",
      standard: "Standard",
      voltageRange: "Voltage range",
      capacitanceRange: "Capacitance range",
      availableParts: "Available parts",
      viewParts: "View parts",
      loading: "Loading catalog...",
      loadFailed: "Failed to load catalog."
    },
    query: {
      title: "Live Product Query",
      intro:
        "Search by part number, category name, or model series. Combine with capacitance and voltage filters as needed.",
      source: "Data source",
      records: "Product records",
      updated: "Last updated",
      keyword: "Keyword",
      keywordPlaceholder: "THQ1 or solid tantalum capacitor",
      partNumber: "Part number",
      seriesId: "Series ID",
      capMin: "Min capacitance (uF)",
      capMax: "Max capacitance (uF)",
      voltMin: "Min voltage (V)",
      voltMax: "Max voltage (V)",
      search: "Search",
      searching: "Searching...",
      reset: "Reset",
      found: "Matches found",
      page: "Page",
      pageOf: "Page {current} / {total}",
      prevPage: "Previous",
      nextPage: "Next",
      selectedItem: "Selected",
      itemRank: "Item {rank} of {total}",
      detailTitle: "Part detail",
      closeDetail: "Close detail panel",
      tolerance: "Tolerance",
      caseCode: "Case code",
      searchContext: "Search context",
      noResults: "No matching products.",
      searchFailed: "Search failed.",
      apiUnavailable: "API server is not running. Start it with npm run dev.",
      columns: {
        partNumber: "Part Number",
        seriesId: "Series",
        description: "Description",
        voltage: "Voltage (V)",
        capacitance: "Capacitance (uF)",
        esr: "ESR"
      }
    },
    ranges: {
      capacitanceTitle: "Capacitance Ranges",
      voltageTitle: "Voltage Ranges",
      capacitance: [
        "< 1uF",
        "1-10uF",
        "10-100uF",
        "100-1000uF",
        "> 1000uF"
      ],
      voltage: ["< 10V", "10-25V", "26-50V", "51-100V", "101-500V", "501-2000V", "> 2000V"]
    },
    featured: {
      title: "THQ Hybrid Capacitor Family",
      bullets: [
        "Ultra-compact footprint for high-density designs",
        "Up to 150,000uF in listed series highlights",
        "Long life reference: 2000h at 85C (rated voltage)",
        "Reliability references include MIL-STD-690C / GJB2649-96 and high MTBF claims"
      ]
    },
    hybridSeries: {
      overview:
        "Based on the EVANS high-energy Hybrid capacitor page: wide capacitance range, very low ESR references, and reliability-oriented military/industrial standards.",
      highlights: [
        "Capacitance range reference: 400uF to 220,000uF",
        "Low ESR reference value: 0.0025 ohm",
        "Application focus: hold-up, pulse discharge, and high-reliability power circuits"
      ],
      tableTitle: "Representative Models",
      columns: {
        model: "Model",
        capacitance: "Max Capacitance (uF)",
        voltage: "Max Voltage (V)",
        temp: "Temp Rating (C)",
        note: "Notes"
      },
      rows: [
        {
          model: "THQ1",
          capacitance: "50,000",
          voltage: "400",
          temp: "150",
          note: "DSCC-oriented high reliability line"
        },
        {
          model: "THQ3",
          capacitance: "150,000",
          voltage: "1300",
          temp: "150",
          note: "High-energy density option"
        },
        {
          model: "THQ5",
          capacitance: "220,000",
          voltage: "1750",
          temp: "150",
          note: "Top-capacity highlight in listed series"
        },
        {
          model: "THS3",
          capacitance: "190,000",
          voltage: "4200",
          temp: "125",
          note: "Very high-voltage reference model"
        }
      ]
    },
    products: [
      {
        name: "EVANS Hybrid Capacitors",
        description:
          "High-reliability hybrid capacitor solutions highlighted on the JODO product page."
      },
      {
        name: "High-Capacitance Modules (up to 220,000uF)",
        description:
          "Large-capacity products for hold-up time and power buffering in demanding circuits."
      },
      {
        name: "Low ESR Pulse-Discharge Capacitors",
        description:
          "Designed for low leakage current, low ESR, and fast charge-discharge performance."
      },
      {
        name: "ADMAT Precision Components",
        description:
          "Precision component line shown on the site for industrial and mission-critical use."
      },
      {
        name: "Thick-Film and Chip Resistor Series",
        description:
          "Compact resistor options for stable operation across industrial temperature ranges."
      },
      {
        name: "Hybrid / Integrated Circuit Modules",
        description:
          "Integrated module offerings for reliable electronic subsystem design."
      },
      {
        name: "Tantalum Capacitor Families",
        description:
          "Includes both solid and non-solid tantalum capacitor categories from the legacy catalog page."
      },
      {
        name: "Ceramic Capacitor Families",
        description:
          "Includes temperature-compensating, high-dielectric, and high-voltage ceramic capacitor lines."
      },
      {
        name: "Film Capacitor Families",
        description:
          "Film capacitor series including polyester and polypropylene classes listed in the product catalog."
      }
    ]
  },
  zh: {
    langCode: "zh-CN",
    nav: {
      products: "产品",
      catalog: "产品目录",
      ranges: "选型指南",
      featured: "重点系列",
      hybridSeries: "混合电容数据",
      about: "关于我们",
      certifications: "资质认证",
      contact: "联系我们",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单"
    },
    hero: {
      eyebrow: "工业电子元器件供应商",
      title: "现代化元件，可靠性能。",
      body: "JODO 为高要求行业提供高可靠性电子元器件与工程支持服务。",
      primaryBtn: "获取报价",
      secondaryBtn: "查看产品",
      visualTags: ["航空航天", "卫星应用", "宇航级元器件"]
    },
    trust: {
      ariaLabel: "企业资质",
      parts: "目录料号数量",
      categories: "产品分类",
      cert: "质量标准",
      certValue: "GJB9001B",
      industry: "核心应用",
      industryValue: "航空航天"
    },
    meta: {
      default: {
        title: "工业元器件",
        description: "JODO 高可靠性电子元器件，服务航空航天、国防与工业领域。"
      },
      products: {
        title: "产品",
        description: "了解 JODO 核心电容产品线与工程能力。"
      },
      catalog: {
        title: "产品目录",
        description: "浏览并搜索 JODO 实时 MDB 产品目录。"
      },
      ranges: {
        title: "选型指南",
        description: "JODO 元器件容量与电压选型范围。"
      },
      featured: {
        title: "重点系列",
        description: "JODO 重点产品系列与规格亮点。"
      },
      hybridSeries: {
        title: "混合电容数据",
        description: "高能量混合电容系列参数与说明。"
      },
      about: {
        title: "关于聚电",
        description: "上海聚电实业有限公司简介、合作伙伴、历程与一站式服务。"
      },
      certifications: {
        title: "资质认证",
        description: "JODO 质量标准与体系认证。"
      },
      contact: {
        title: "联系我们",
        description: "联系 JODO 获取报价与技术支持。"
      }
    },
    sections: {
      products: "核心产品线",
      ranges: "电容值与电压选型",
      featured: "THQ 系列亮点",
      hybridSeries: "高能量混合电容系列",
      about: "关于聚电",
      certifications: "质量与认证",
      contact: "联系 JODO"
    },
    aboutPage: {
      goal: "聚电的目标是：提供世界最高水平的产品。",
      overview: [
        "以客户为中心的发展战略，凭借广泛的国内外营销网络，快速响应并提供“一站式”服务。",
        "研发实力是核心竞争力。上海聚电实业有限公司是 Evans 与 Admat 在全球的战略支柱之一，既负责本地化开发，也参与其全球项目。",
        "依托本地优势与国际资源，为客户提供量身定制的解决方案，为股东创造回报，为员工提供机会，努力成为中国电子行业的优秀企业。"
      ],
      historyTitle: "聚电的历程",
      history: [
        "2004 年成立上海聚电实业有限公司，作为 Evans 钽电容器代理，负责中国大陆地区的全面推广与销售。",
        "聚电元器件广泛应用于工业、计算机、汽车、消费、通讯、航空及医疗等领域的电子设备。"
      ],
      innovationTitle: "通过创新和合作来促进发展",
      innovation: [
        "不断推动小型化与高性能的极限。",
        "EVANS 与 ADMAT 是技术领先者，也是全球先进的被动元件制造商。"
      ],
      serviceTitle: "“一站式”服务",
      service: [
        "客户可提供物料清单（BOM），聚电按产品线进行匹配，实现单一供应商采购的便利。",
        "同时为全球设计工程师提供免费样品支持。详情见 www.jodo.com.cn。",
        "产品线覆盖专用与通用元器件，包括电阻、电容、电感、传感器及相关滤波器等，以服务、创新、质量与成本控制持续提升竞争力。"
      ],
      contactTitle: "联系我们",
      certificationsTitle: "质量与认证"
    },
    certifications: ["ISO 9000 质量体系", "GJB9001B-2009 体系符合性", "高可靠性标准"],
    contact: {
      email: "邮箱: sales@jodo.com.cn",
      website: "网站: www.jodo.com.cn"
    },
    search: {
      placeholder: "搜索料号、产品分类或系列...",
      button: "搜索",
      heroHint: "支持按料号、产品分类（如固体电解质钽电容器）或系列型号搜索。"
    },
    catalog: {
      title: "产品目录",
      intro: "在同一页面浏览产品分类并查询料号，数据来自 MDB 实时目录。",
      categories: "产品分类",
      models: "个型号",
      modelCount: "系列型号",
      partCount: "可用料号",
      standard: "执行标准",
      voltageRange: "电压范围",
      capacitanceRange: "容量范围",
      availableParts: "可用料号数",
      viewParts: "查看料号",
      loading: "目录加载中...",
      loadFailed: "目录加载失败。"
    },
    query: {
      title: "产品实时查询",
      intro:
        "可按料号、产品分类名称或系列型号搜索，并可配合容量、电压等条件筛选。",
      source: "数据源",
      records: "产品记录数",
      updated: "最后更新时间",
      keyword: "关键词",
      keywordPlaceholder: "THQ1 或 固体电解质钽电容器",
      partNumber: "料号",
      seriesId: "系列编号",
      capMin: "最小容量 (uF)",
      capMax: "最大容量 (uF)",
      voltMin: "最小电压 (V)",
      voltMax: "最大电压 (V)",
      search: "查询",
      searching: "查询中...",
      reset: "重置",
      found: "匹配结果",
      page: "页码",
      pageOf: "第 {current} / {total} 页",
      prevPage: "上一页",
      nextPage: "下一页",
      selectedItem: "当前选中",
      itemRank: "第 {rank} 条 / 共 {total} 条",
      detailTitle: "料号详情",
      closeDetail: "关闭详情面板",
      tolerance: "容差",
      caseCode: "封装",
      searchContext: "搜索上下文",
      noResults: "没有匹配的产品。",
      searchFailed: "查询失败。",
      apiUnavailable: "API 服务未启动，请运行 npm run dev。",
      columns: {
        partNumber: "料号",
        seriesId: "系列",
        description: "规格描述",
        voltage: "电压 (V)",
        capacitance: "容量 (uF)",
        esr: "ESR"
      }
    },
    ranges: {
      capacitanceTitle: "电容范围",
      voltageTitle: "电压范围",
      capacitance: ["< 1uF", "1-10uF", "10-100uF", "100-1000uF", "> 1000uF"],
      voltage: ["< 10V", "10-25V", "26-50V", "51-100V", "101-500V", "501-2000V", "> 2000V"]
    },
    featured: {
      title: "THQ 混合电容系列",
      bullets: [
        "适合高密度设计的小型化封装",
        "页面亮点参数显示容量可达 150,000uF",
        "寿命参考: 85C 额定电压条件下 2000 小时",
        "可靠性参考标准含 MIL-STD-690C / GJB2649-96 与高 MTBF 指标"
      ]
    },
    hybridSeries: {
      overview:
        "基于 EVANS 高能量 Hybrid 页面信息：覆盖宽容量范围，强调低 ESR 表现，并面向军工/工业级可靠性场景。",
      highlights: [
        "容量范围参考: 400uF 至 220,000uF",
        "低 ESR 参考值: 0.0025 欧姆",
        "应用方向: 保持供电、脉冲放电及高可靠电源电路"
      ],
      tableTitle: "代表型号",
      columns: {
        model: "型号",
        capacitance: "最大容量 (uF)",
        voltage: "最大电压 (V)",
        temp: "温度等级 (C)",
        note: "说明"
      },
      rows: [
        {
          model: "THQ1",
          capacitance: "50,000",
          voltage: "400",
          temp: "150",
          note: "面向 DSCC 体系的高可靠系列"
        },
        {
          model: "THQ3",
          capacitance: "150,000",
          voltage: "1300",
          temp: "150",
          note: "高能量密度型号"
        },
        {
          model: "THQ5",
          capacitance: "220,000",
          voltage: "1750",
          temp: "150",
          note: "页面中重点展示的超大容量型号"
        },
        {
          model: "THS3",
          capacitance: "190,000",
          voltage: "4200",
          temp: "125",
          note: "高电压参考型号"
        }
      ]
    },
    products: [
      {
        name: "EVANS 混合电容",
        description: "官网重点展示的高可靠性混合电容解决方案。"
      },
      {
        name: "大容量模块（最高 220,000uF）",
        description: "适用于保持时间与电源缓冲等高要求电路场景。"
      },
      {
        name: "低 ESR 脉冲放电电容",
        description: "具备低漏电、低 ESR 与快速充放电特性。"
      },
      {
        name: "ADMAT 精密元件",
        description: "面向工业级与高可靠应用的精密元件系列。"
      },
      {
        name: "厚膜与贴片电阻系列",
        description: "适合工业温度范围内稳定运行的紧凑型电阻方案。"
      },
      {
        name: "混合集成电路模块",
        description: "用于高可靠电子子系统设计的集成模块产品。"
      },
      {
        name: "钽电容系列",
        description: "覆盖固体钽与非固体钽等目录产品分类。"
      },
      {
        name: "陶瓷电容系列",
        description: "覆盖温度补偿型、高介电常数型及高压陶瓷电容。"
      },
      {
        name: "薄膜电容系列",
        description: "包含聚酯薄膜与聚丙烯薄膜等目录产品线。"
      }
    ]
  },
  ja: {
    langCode: "ja",
    nav: {
      products: "製品",
      catalog: "製品カタログ",
      ranges: "選定ガイド",
      featured: "注目シリーズ",
      hybridSeries: "ハイブリッド仕様",
      about: "会社情報",
      certifications: "認証",
      contact: "お問い合わせ",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる"
    },
    hero: {
      eyebrow: "産業用電子部品サプライヤー",
      title: "モダンな部品、実証された信頼性。",
      body: "JODO は高信頼性電子部品とエンジニアリング支援を提供します。",
      primaryBtn: "見積もりを依頼",
      secondaryBtn: "製品を見る",
      visualTags: ["航空宇宙", "衛星用途", "宇宙グレード部品"]
    },
    trust: {
      ariaLabel: "企業実績",
      parts: "カタログ部品数",
      categories: "製品カテゴリ",
      cert: "品質基準",
      certValue: "GJB9001B",
      industry: "主要用途",
      industryValue: "航空宇宙"
    },
    meta: {
      default: {
        title: "産業用部品",
        description: "航空宇宙・防衛・産業向けの JODO 高信頼性電子部品。"
      },
      products: {
        title: "製品",
        description: "JODO の主要コンデンサ製品ラインをご覧ください。"
      },
      catalog: {
        title: "製品カタログ",
        description: "ライブ MDB カタログから部品を検索・閲覧できます。"
      },
      ranges: {
        title: "選定ガイド",
        description: "容量・電圧の選定範囲を確認できます。"
      },
      featured: {
        title: "注目シリーズ",
        description: "JODO の注目製品シリーズと仕様。"
      },
      hybridSeries: {
        title: "ハイブリッド仕様",
        description: "高エネルギー・ハイブリッドコンデンサシリーズ。"
      },
      about: {
        title: "JODO について",
        description: "上海聚電実業有限公司の概要、パートナー、沿革、ワンストップサービス。"
      },
      certifications: {
        title: "認証",
        description: "JODO の品質基準と認証情報。"
      },
      contact: {
        title: "お問い合わせ",
        description: "見積もり・技術支援のお問い合わせ。"
      }
    },
    sections: {
      products: "主要製品ライン",
      ranges: "静電容量・電圧の選定",
      featured: "THQ シリーズのハイライト",
      hybridSeries: "高エネルギー・ハイブリッドシリーズ",
      about: "JODO について",
      certifications: "品質・認証",
      contact: "JODO への連絡"
    },
    aboutPage: {
      goal: "JODO の目標は、世界最高水準の製品を提供することです。",
      overview: [
        "顧客中心の成長戦略のもと、国内外の幅広い販売ネットワークにより迅速に対応し、ワンストップサービスを提供します。",
        "研究開発力は中核競争力です。上海聚電実業有限公司は Evans および Admat のグローバル戦略の重要な柱として、現地開発を担い、世界プロジェクトにも参画しています。",
        "現地の強みと国際リソースを活かし、顧客には最適なソリューションを、株主にはリターンを、社員には機会を提供し、中国の電子産業における優れた企業を目指します。"
      ],
      historyTitle: "沿革",
      history: [
        "2004年に上海聚電実業有限公司として設立。Evans タンタルコンデンサの代理店として、中国大陸での販売・展開を担当してきました。",
        "JODO の部品は、産業、コンピュータ、自動車、民生、通信、航空、医療などの電子機器に広く使用されています。"
      ],
      innovationTitle: "イノベーションと協業による成長",
      innovation: [
        "小型化と高性能の限界に挑戦し続けます。",
        "EVANS と ADMAT は技術リーダーであり、世界でも先進的な受動部品メーカーです。"
      ],
      serviceTitle: "ワンストップサービス",
      service: [
        "お客様は部品表（BOM）をご提示いただければ、当社製品ラインと照合し、単一サプライヤでの調達を支援します。",
        "また、世界中の設計エンジニアに無償サンプルを提供しています。詳細は www.jodo.com.cn をご覧ください。",
        "製品は特殊品から汎用品まで幅広く、抵抗、コンデンサ、インダクタ、センサ、各種フィルタなどを扱い、サービス・革新・品質・コスト管理で競争力を高めています。"
      ],
      contactTitle: "お問い合わせ",
      certificationsTitle: "品質・認証"
    },
    certifications: ["ISO 9000 品質プロセス", "GJB9001B-2009 準拠", "高信頼性基準"],
    contact: {
      email: "メール: sales@jodo.com.cn",
      website: "Web: www.jodo.com.cn"
    },
    search: {
      placeholder: "部品番号、カテゴリ、シリーズを検索...",
      button: "検索",
      heroHint:
        "部品番号、製品カテゴリ（例：固体電解質タンタルコンデンサ）、シリーズ名で検索できます。"
    },
    catalog: {
      title: "製品カタログ",
      intro:
        "MDB のライブカタログから、製品カテゴリの閲覧と部品検索を同一ページで行えます。",
      categories: "カテゴリ",
      models: "モデル",
      modelCount: "シリーズ数",
      partCount: "部品数",
      standard: "規格",
      voltageRange: "電圧範囲",
      capacitanceRange: "容量範囲",
      availableParts: "利用可能部品数",
      viewParts: "部品を見る",
      loading: "カタログ読み込み中...",
      loadFailed: "カタログの読み込みに失敗しました。"
    },
    query: {
      title: "製品リアルタイム検索",
      intro:
        "部品番号、カテゴリ名、シリーズ名で検索でき、容量・電圧条件と組み合わせられます。",
      source: "データソース",
      records: "製品件数",
      updated: "最終更新",
      keyword: "キーワード",
      keywordPlaceholder: "THQ1 または 固体電解質タンタル",
      partNumber: "部品番号",
      seriesId: "シリーズ ID",
      capMin: "最小容量 (uF)",
      capMax: "最大容量 (uF)",
      voltMin: "最小電圧 (V)",
      voltMax: "最大電圧 (V)",
      search: "検索",
      searching: "検索中...",
      reset: "リセット",
      found: "一致件数",
      page: "ページ",
      pageOf: "{current} / {total} ページ",
      prevPage: "前へ",
      nextPage: "次へ",
      selectedItem: "選択中",
      itemRank: "{total} 件中 {rank} 件目",
      detailTitle: "部品詳細",
      closeDetail: "詳細パネルを閉じる",
      tolerance: "許容差",
      caseCode: "ケース",
      searchContext: "検索コンテキスト",
      noResults: "一致する製品がありません。",
      searchFailed: "検索に失敗しました。",
      apiUnavailable: "API サーバーが起動していません。npm run dev を実行してください。",
      columns: {
        partNumber: "部品番号",
        seriesId: "シリーズ",
        description: "仕様",
        voltage: "電圧 (V)",
        capacitance: "容量 (uF)",
        esr: "ESR"
      }
    },
    ranges: {
      capacitanceTitle: "静電容量レンジ",
      voltageTitle: "電圧レンジ",
      capacitance: ["< 1uF", "1-10uF", "10-100uF", "100-1000uF", "> 1000uF"],
      voltage: ["< 10V", "10-25V", "26-50V", "51-100V", "101-500V", "501-2000V", "> 2000V"]
    },
    featured: {
      title: "THQ ハイブリッドシリーズ",
      bullets: [
        "高密度設計向けの超小型フォームファクタ",
        "掲載ハイライトでは最大 150,000uF を提示",
        "寿命目安: 85C・定格電圧で 2000 時間",
        "MIL-STD-690C / GJB2649-96 や高 MTBF 主張を含む信頼性情報"
      ]
    },
    hybridSeries: {
      overview:
        "EVANS 高エネルギー Hybrid ページに基づく情報: 広い容量レンジ、低 ESR 指標、軍用/産業向け高信頼性。",
      highlights: [
        "容量レンジ参考: 400uF - 220,000uF",
        "低 ESR 参考値: 0.0025 ohm",
        "用途: ホールドアップ、パルス放電、高信頼電源回路"
      ],
      tableTitle: "代表モデル",
      columns: {
        model: "型番",
        capacitance: "最大容量 (uF)",
        voltage: "最大電圧 (V)",
        temp: "温度定格 (C)",
        note: "備考"
      },
      rows: [
        {
          model: "THQ1",
          capacitance: "50,000",
          voltage: "400",
          temp: "150",
          note: "DSCC 系の高信頼ライン"
        },
        {
          model: "THQ3",
          capacitance: "150,000",
          voltage: "1300",
          temp: "150",
          note: "高エネルギー密度モデル"
        },
        {
          model: "THQ5",
          capacitance: "220,000",
          voltage: "1750",
          temp: "150",
          note: "掲載シリーズ中の最大容量ハイライト"
        },
        {
          model: "THS3",
          capacitance: "190,000",
          voltage: "4200",
          temp: "125",
          note: "高電圧リファレンスモデル"
        }
      ]
    },
    products: [
      {
        name: "EVANS ハイブリッドコンデンサ",
        description:
          "JODO 製品ページで紹介される高信頼ハイブリッドコンデンサ。"
      },
      {
        name: "大容量モジュール（最大 220,000uF）",
        description:
          "ホールドアップ時間や電源バッファ用途に対応する大容量製品。"
      },
      {
        name: "低 ESR パルス放電コンデンサ",
        description:
          "低リーク電流・低 ESR・高速充放電に対応した設計。"
      },
      {
        name: "ADMAT 精密コンポーネント",
        description: "産業用途・高信頼用途向けの精密部品ライン。"
      },
      {
        name: "厚膜・チップ抵抗シリーズ",
        description:
          "産業温度環境で安定動作するコンパクト抵抗シリーズ。"
      },
      {
        name: "ハイブリッド / 集積回路モジュール",
        description: "高信頼電子サブシステム向けの統合モジュール製品。"
      },
      {
        name: "タンタルコンデンサ系列",
        description:
          "従来カタログにある固体/非固体タンタルカテゴリを含む製品群。"
      },
      {
        name: "セラミックコンデンサ系列",
        description:
          "温度補償型・高誘電率型・高電圧型のセラミック系列をカバー。"
      },
      {
        name: "フィルムコンデンサ系列",
        description:
          "ポリエステル/ポリプロピレンなどのフィルム系列を含む製品ライン。"
      }
    ]
  }
};

function QueryRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/catalog${search}`} replace />;
}

function DocumentTitleUpdater({ t }) {
  const location = useLocation();
  const meta = useMemo(() => {
    const routes = {
      "/products": t.meta.products,
      "/catalog": t.meta.catalog,
      "/selection-guide": t.meta.ranges,
      "/featured": t.meta.featured,
      "/hybrid-series": t.meta.hybridSeries,
      "/about": t.meta.about,
      "/certifications": t.meta.about,
      "/contact": t.meta.about
    };

    return routes[location.pathname] ?? t.meta.default;
  }, [location.pathname, t]);

  useDocumentTitle(`${meta.title} | JODO`, meta.description);
  return null;
}

function AboutPage({ t }) {
  const location = useLocation();

  useEffect(() => {
    const targetId = location.hash.replace(/^#/, "");
    if (!targetId) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <section className="section">
      <div className="container">
        <h3>{t.sections.about}</h3>
        <article className="card about-page">
          <p className="about-goal">{t.aboutPage.goal}</p>
          {t.aboutPage.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4>{t.aboutPage.historyTitle}</h4>
          {t.aboutPage.history.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4>{t.aboutPage.innovationTitle}</h4>
          {t.aboutPage.innovation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4>{t.aboutPage.serviceTitle}</h4>
          {t.aboutPage.service.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4 id="certifications">{t.aboutPage.certificationsTitle}</h4>
          <ul className="list">
            {t.certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h4 id="contact">{t.aboutPage.contactTitle}</h4>
          <p>{t.contact.email}</p>
          <p>{t.contact.website}</p>
        </article>
      </div>
    </section>
  );
}

function App() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[language];

  useEffect(() => {
    document.documentElement.lang = t.langCode;
  }, [t.langCode]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 760) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Keep selection-guide / featured / contact / certifications in code; hide from nav for now.
  const navItems = useMemo(
    () =>
      [
        { to: "/products", label: t.nav.products },
        { to: "/catalog", label: t.nav.catalog },
        { to: "/selection-guide", label: t.nav.ranges, hidden: true },
        { to: "/featured", label: t.nav.featured, hidden: true },
        { to: "/hybrid-series", label: t.nav.hybridSeries },
        { to: "/about", label: t.nav.about },
        { to: "/certifications", label: t.nav.certifications, hidden: true },
        { to: "/contact", label: t.nav.contact, hidden: true }
      ].filter((item) => !item.hidden),
    [t]
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <DocumentTitleUpdater t={t} />
      <div className="site">
        <div className="tech-bg" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="grid-glow" />
        </div>
        <header className="topbar">
          <div className={`container nav${menuOpen ? " is-open" : ""}`}>
            <NavLink to="/" className="brand" onClick={closeMenu}>
              JODO
            </NavLink>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-nav-panel"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <div id="primary-nav-panel" className="nav-panel">
              <nav>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="lang-switch" aria-label="Language Switch">
                <button
                  type="button"
                  className={language === "en" ? "active" : ""}
                  onClick={() => setLanguage("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={language === "zh" ? "active" : ""}
                  onClick={() => setLanguage("zh")}
                >
                  中文
                </button>
                <button
                  type="button"
                  className={language === "ja" ? "active" : ""}
                  onClick={() => setLanguage("ja")}
                >
                  日本語
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>
          <PageTransition>
            <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route
              path="/products"
              element={
                <>
                  <section className="hero">
                    <div className="container hero-inner">
                      <div className="hero-content">
                        <p className="eyebrow">{t.hero.eyebrow}</p>
                        <h2>{t.hero.title}</h2>
                        <p>{t.hero.body}</p>
                        <div className="hero-actions">
                          <NavLink to="/about#contact" className="btn primary">
                            {t.hero.primaryBtn}
                          </NavLink>
                          <NavLink to="/catalog" className="btn ghost">
                            {t.hero.secondaryBtn}
                          </NavLink>
                        </div>
                        <div className="tech-metrics">
                          <span>220,000uF</span>
                          <span>0.0025 ohm ESR</span>
                          <span>MTBF 10,000,000h</span>
                        </div>
                      </div>
                      <HeroBackground labels={t.hero.visualTags} />
                    </div>
                  </section>
                  <TrustBar t={t} />
                  <ScrollReveal>
                    <section className="section">
                      <div className="container">
                        <h3 className="section-heading">{t.sections.products}</h3>
                        <div className="grid">
                          {t.products.map((product) => (
                            <article key={product.name} className="card">
                              <h4>{product.name}</h4>
                              <p>{product.description}</p>
                            </article>
                          ))}
                        </div>
                      </div>
                    </section>
                  </ScrollReveal>
                </>
              }
            />
            <Route
              path="/selection-guide"
              element={
                <ScrollReveal>
                  <section className="section">
                    <div className="container">
                      <h3 className="section-heading">{t.sections.ranges}</h3>
                    <div className="grid">
                      <article className="card">
                        <h4>{t.ranges.capacitanceTitle}</h4>
                        <ul className="list">
                          {t.ranges.capacitance.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                      <article className="card">
                        <h4>{t.ranges.voltageTitle}</h4>
                        <ul className="list">
                          {t.ranges.voltage.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    </div>
                    </div>
                  </section>
                </ScrollReveal>
              }
            />
            <Route
              path="/featured"
              element={
                <ScrollReveal>
                  <section className="section">
                    <div className="container">
                      <h3 className="section-heading">{t.sections.featured}</h3>
                    <article className="card">
                      <h4>{t.featured.title}</h4>
                      <ul className="list">
                        {t.featured.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </section>
                </ScrollReveal>
              }
            />
            <Route
              path="/hybrid-series"
              element={
                <section className="section">
                  <div className="container">
                    <h3>{t.sections.hybridSeries}</h3>
                    <p>{t.hybridSeries.overview}</p>
                    <ul className="list">
                      {t.hybridSeries.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <article className="card">
                      <h4>{t.hybridSeries.tableTitle}</h4>
                      <div className="table-wrap">
                        <table className="spec-table">
                          <thead>
                            <tr>
                              <th>{t.hybridSeries.columns.model}</th>
                              <th>{t.hybridSeries.columns.capacitance}</th>
                              <th>{t.hybridSeries.columns.voltage}</th>
                              <th>{t.hybridSeries.columns.temp}</th>
                              <th>{t.hybridSeries.columns.note}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {t.hybridSeries.rows.map((row) => (
                              <tr key={row.model}>
                                <td>{row.model}</td>
                                <td>{row.capacitance}</td>
                                <td>{row.voltage}</td>
                                <td>{row.temp}</td>
                                <td>{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  </div>
                </section>
              }
            />
            <Route path="/about" element={<AboutPage t={t} />} />
            <Route
              path="/certifications"
              element={<Navigate to="/about#certifications" replace />}
            />
            <Route
              path="/catalog"
              element={<ProductCatalogPage t={t} language={language} />}
            />
            <Route path="/query" element={<QueryRedirect />} />
            <Route path="/contact" element={<Navigate to="/about#contact" replace />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </PageTransition>
        </main>

        <footer className="footer">
          <div className="container">
            <h3>{t.sections.contact}</h3>
            <p>{t.contact.email}</p>
            <p>{t.contact.website}</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
