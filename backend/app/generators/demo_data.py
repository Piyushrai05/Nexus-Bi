import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import pandas as pd
from app.core.config import settings
from app.core.logging import logger

RANDOM_SEED = 42

REGIONS = ["West", "East", "Central", "South"]
CHANNELS = ["Direct", "Organic Search", "Paid Social", "Email", "Affiliate"]
PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "YouTube", "X"]
CUSTOMER_SEGMENTS = ["Enterprise", "Mid-Market", "SMB", "Consumer"]

CATEGORIES = {
    "Electronics": [
        ("UltraWide 34-inch Monitor", 320.0, 549.99, 120),
        ("Mechanical Ergonomic Keyboard", 65.0, 129.99, 250),
        ("Noise-Cancelling Headphones Pro", 110.0, 249.99, 180),
        ("USB-C Quad Hub Station", 28.0, 69.99, 400),
        ("4K Streaming Webcam Pro", 45.0, 99.99, 210),
        ("Smart Wireless Trackpad", 40.0, 89.99, 150),
        ("Compact Studio Microphone", 55.0, 119.99, 190),
        ("Dual-Arm Aluminum Monitor Mount", 35.0, 79.99, 310),
    ],
    "Apparel": [
        ("Merino Wool Tech Hoodie", 35.0, 98.0, 450),
        ("Performance Chino Pants", 28.0, 78.0, 500),
        ("Everyday Seamless Crewneck", 14.0, 38.0, 800),
        ("Water-Resistant Commuter Jacket", 55.0, 148.0, 220),
        ("Breathable Athletic Polo", 18.0, 48.0, 600),
        ("Tailored Stretch Blazer", 70.0, 188.0, 160),
        ("Merino Wool Beanie", 12.0, 32.0, 400),
        ("Organic Cotton Essential Tee 3-Pack", 18.0, 48.0, 900),
    ],
    "Home Goods": [
        ("Ergonomic Memory Foam Cushion", 18.0, 45.0, 350),
        ("Minimalist Ceramic Desk Lamp", 22.0, 58.0, 280),
        ("Aroma Ultrasonic Diffuser", 16.0, 39.0, 410),
        ("Double-Walled Steel Tumbler", 9.0, 24.0, 650),
        ("Weighted Bamboo Sleep Blanket", 45.0, 115.0, 190),
        ("Solid Walnut Monitor Riser", 32.0, 79.0, 220),
    ],
}

def generate_nexusmart_data(seed: int = RANDOM_SEED) -> Dict[str, pd.DataFrame]:
    random.seed(seed)
    logger.info(f"Generating deterministic NexusMart demo datasets with seed={seed}...")

    # 1. PRODUCTS
    products_list = []
    prod_counter = 1
    for cat, items in CATEGORIES.items():
        for name, cost, price, stock in items:
            p_id = f"PROD-{prod_counter:03d}"
            products_list.append({
                "product_id": p_id,
                "product_name": name,
                "category": cat,
                "unit_cost": cost,
                "selling_price": price,
                "stock_quantity": stock,
            })
            prod_counter += 1
    df_products = pd.DataFrame(products_list)

    # 2. CUSTOMERS (300 records)
    customers_list = []
    start_date = datetime(2025, 1, 1)
    first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Avery",
                   "Elena", "Marcus", "Sarah", "David", "Chloe", "Noah", "Liam", "Emma", "Olivia", "James"]
    last_names = ["Vance", "Rostova", "Jenkins", "Chen", "Bennett", "Kowalski", "Mueller", "O'Connor", "Kim", "Patel",
                  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]

    for i in range(1, 301):
        c_id = f"CUST-{i:04d}"
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        acq_date = start_date + timedelta(days=random.randint(0, 365))
        reg = random.choice(REGIONS)
        seg = random.choices(CUSTOMER_SEGMENTS, weights=[0.15, 0.25, 0.35, 0.25])[0]
        chan = random.choice(CHANNELS)
        
        customers_list.append({
            "customer_id": c_id,
            "customer_name": f"{fn} {ln}",
            "acquisition_date": acq_date.strftime("%Y-%m-%d"),
            "region": reg,
            "customer_segment": seg,
            "acquisition_channel": chan,
            "lifetime_value": 0.0, # Updated after orders
            "last_purchase_date": acq_date.strftime("%Y-%m-%d"),
        })
    df_customers = pd.DataFrame(customers_list)

    # 3. CAMPAIGNS (12 records)
    campaigns_data = [
        ("CAMP-001", "Instagram Spring Apparel Wave", "Instagram", "2026-10-15", "2026-11-20", 14500.0, 580000, 18500, 310, 22400.0), # Story 2: High Vanity Engagement, lower ROAS
        ("CAMP-002", "LinkedIn B2B Workspace Blitz", "LinkedIn", "2026-10-01", "2026-11-20", 8200.0, 142000, 4800, 280, 39400.0),   # High ROAS (4.8x)
        ("CAMP-003", "TikTok Viral Tech Desk Setup", "TikTok", "2026-10-20", "2026-11-15", 9800.0, 720000, 14200, 210, 15800.0),
        ("CAMP-004", "YouTube Deep Dive Monitor Review", "YouTube", "2026-09-01", "2026-11-20", 11200.0, 310000, 8900, 340, 34800.0),
        ("CAMP-005", "Google Search Intent - Core", "Organic Search", "2026-01-01", "2026-11-20", 24000.0, 950000, 45000, 1450, 168000.0),
        ("CAMP-006", "Holiday Early Bird Preview", "Email", "2026-11-01", "2026-11-20", 3200.0, 95000, 12800, 520, 58400.0),
        ("CAMP-007", "X Developer Ergonomics Thread", "X", "2026-10-10", "2026-11-10", 4100.0, 180000, 3900, 85, 6200.0),
        ("CAMP-008", "Influencer Unboxing Surge", "TikTok", "2026-10-28", "2026-11-12", 6400.0, 410000, 9800, 140, 11200.0),
        ("CAMP-009", "Minimalist Living Retargeting", "Instagram", "2026-10-01", "2026-11-20", 5600.0, 220000, 6800, 190, 19800.0),
        ("CAMP-010", "Affiliate Tech Review Roundups", "Affiliate", "2026-08-01", "2026-11-20", 7800.0, 290000, 11400, 410, 48200.0),
        ("CAMP-011", "Black Friday Warmup Push", "Instagram", "2026-11-10", "2026-11-20", 12800.0, 490000, 16200, 380, 31200.0),
        ("CAMP-012", "Executive Ergonomics Whitepaper", "LinkedIn", "2026-10-15", "2026-11-20", 4500.0, 88000, 2400, 110, 18900.0),
    ]
    df_campaigns = pd.DataFrame(campaigns_data, columns=[
        "campaign_id", "campaign_name", "platform", "campaign_start", "campaign_end",
        "spend", "impressions", "clicks", "conversions", "attributed_revenue"
    ])

    # 4. SALES ORDERS (2,500 records spanning Oct 01, 2026 to Nov 21, 2026)
    orders_list = []
    base_order_date = datetime(2026, 9, 1)
    
    # Story 1 Setup: West Region Electronics decline period (Nov 09 to Nov 16)
    story1_start = datetime(2026, 11, 9)
    story1_end = datetime(2026, 11, 16)

    for o_idx in range(1, 2501):
        o_id = f"ORD-{o_idx:05d}"
        days_offset = random.randint(0, 81) # Up to Nov 21, 2026
        o_date = base_order_date + timedelta(days=days_offset)
        
        cust = random.choice(customers_list)
        c_id = cust["customer_id"]
        reg = cust["region"]
        
        # Product selection
        prod = random.choice(products_list)
        p_id = prod["product_id"]
        cat = prod["category"]
        
        # Plant Story 1: In West Region between Nov 9 and Nov 16, Electronics demand drops & stockout happens!
        if story1_start <= o_date <= story1_end and reg == "West" and cat == "Electronics":
            if random.random() < 0.65:
                # Stockout re-routed or canceled: switch product to low-cost Home Goods or skip
                prod = random.choice([p for p in products_list if p["category"] != "Electronics"])
                p_id = prod["product_id"]
                cat = prod["category"]
        
        qty = random.choices([1, 2, 3, 4, 5, 8], weights=[0.55, 0.25, 0.10, 0.05, 0.03, 0.02])[0]
        u_price = prod["selling_price"]
        u_cost = prod["unit_cost"]
        
        # Discounts: usually 0%, sometimes 10% or 15%
        disc_rate = random.choices([0.0, 0.05, 0.10, 0.15, 0.20], weights=[0.60, 0.15, 0.15, 0.07, 0.03])[0]
        
        # Planted Story 1: If West Region Electronics during story window, higher discount & return rate
        if story1_start <= o_date <= story1_end and reg == "West":
            disc_rate = max(disc_rate, 0.15)
            
        rev = round(qty * u_price * (1.0 - disc_rate), 2)
        tot_cost = round(qty * u_cost, 2)
        profit = round(rev - tot_cost, 2)
        
        chan = random.choice(CHANNELS)
        camp_id = random.choice(df_campaigns["campaign_id"].tolist()) if random.random() < 0.45 else None
        
        orders_list.append({
            "order_id": o_id,
            "order_date": o_date.strftime("%Y-%m-%d"),
            "customer_id": c_id,
            "product_id": p_id,
            "region": reg,
            "quantity": qty,
            "unit_price": u_price,
            "discount": disc_rate,
            "revenue": rev,
            "cost": tot_cost,
            "profit": profit,
            "channel": chan,
            "campaign_id": camp_id,
        })
        
        # Update customer LTV and last purchase
        cust["lifetime_value"] = round(cust["lifetime_value"] + rev, 2)
        if o_date.strftime("%Y-%m-%d") > cust["last_purchase_date"]:
            cust["last_purchase_date"] = o_date.strftime("%Y-%m-%d")

    df_sales = pd.DataFrame(orders_list)
    df_customers = pd.DataFrame(customers_list) # Re-bind updated LTV

    # 5. SOCIAL POSTS (200 records)
    posts_list = []
    content_types = ["Reel", "Carousel", "Static Image", "Video", "Text Thread"]
    content_categories = ["Product Feature", "Customer Story", "Discount Alert", "Behind the Scenes", "Educational"]

    for p_idx in range(1, 201):
        post_id = f"POST-{p_idx:04d}"
        c_item = df_campaigns.sample(1).iloc[0]
        c_id = c_item["campaign_id"]
        plat = c_item["platform"]
        
        p_date = datetime.strptime(c_item["campaign_start"], "%Y-%m-%d") + timedelta(days=random.randint(0, 25))
        c_type = random.choice(content_types)
        c_cat = random.choice(content_categories)
        
        # Story 2 Plant: Instagram Spring Apparel posts have huge impressions & likes, but lower conversions
        if c_id == "CAMP-001":
            impr = random.randint(15000, 65000)
            reach = int(impr * random.uniform(0.75, 0.88))
            likes = int(impr * random.uniform(0.06, 0.09)) # High engagement!
            comments = int(likes * random.uniform(0.08, 0.15))
            shares = int(likes * random.uniform(0.05, 0.12))
            clicks = int(impr * random.uniform(0.015, 0.025))
            conv = int(clicks * random.uniform(0.012, 0.018)) # Lower conversion!
            s_score = round(random.uniform(0.70, 0.95), 2)
        else:
            impr = random.randint(3000, 35000)
            reach = int(impr * random.uniform(0.70, 0.85))
            likes = int(impr * random.uniform(0.02, 0.05))
            comments = int(likes * random.uniform(0.04, 0.08))
            shares = int(likes * random.uniform(0.02, 0.05))
            clicks = int(impr * random.uniform(0.02, 0.04))
            conv = int(clicks * random.uniform(0.025, 0.045))
            s_score = round(random.uniform(0.40, 0.85), 2)

        views = impr if c_type in ["Reel", "Video"] else int(impr * 0.2)

        posts_list.append({
            "post_id": post_id,
            "platform": plat,
            "publish_date": p_date.strftime("%Y-%m-%d"),
            "campaign_id": c_id,
            "content_type": c_type,
            "content_category": c_cat,
            "impressions": impr,
            "reach": reach,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "video_views": views,
            "clicks": clicks,
            "conversions": conv,
            "sentiment_score": s_score,
        })
    df_social_posts = pd.DataFrame(posts_list)

    # 6. SOCIAL SENTIMENT & MENTIONS (600 records)
    mentions_list = []
    topics = ["Product Quality", "Shipping Speed", "Customer Support", "Pricing", "Packaging", "Website Experience"]
    
    positive_excerpts = [
        "Unbelievable display clarity on the 34-inch monitor, completely transformed my remote workflow!",
        "The merino wool hoodie is legitimately the best piece of apparel I purchased all year.",
        "Fastest checkout experience and arrived in 2 days flat.",
        "Love the aesthetic packaging and sustainable materials.",
        "Customer support refunded an accidental duplicate order in less than 5 minutes.",
    ]
    neutral_excerpts = [
        "Monitor stand is decent, assembly instructions could have been slightly clearer.",
        "Arrived on the scheduled date, fits true to size.",
        "Standard pricing for ergonomic gear, matches expectations.",
        "Product works as described on the website.",
    ]
    negative_excerpts = [
        "Ordered the monitor 8 days ago and tracking still says label created. Very frustrating shipping delay.",
        "Zipper on the jacket snagged on day two, expected higher durability.",
        "Waited 45 minutes on support chat just to ask about a backorder.",
        "Why is the West Coast warehouse always out of stock on flagships?",
    ]

    base_mention_date = datetime(2026, 10, 1)
    for m_idx in range(1, 601):
        m_id = f"MENTION-{m_idx:05d}"
        m_date = base_mention_date + timedelta(days=random.randint(0, 51))
        plat = random.choice(PLATFORMS)
        topic = random.choice(topics)
        
        # Plant Story 1 & Social Anomaly: Nov 10-16 has negative spike in West shipping & stockout mentions
        if datetime(2026, 11, 10) <= m_date <= datetime(2026, 11, 17) and random.random() < 0.60:
            sentiment = "Negative"
            excerpt = random.choice(negative_excerpts)
            topic = random.choice(["Shipping Speed", "Customer Support"])
        else:
            sentiment = random.choices(["Positive", "Neutral", "Negative"], weights=[0.65, 0.20, 0.15])[0]
            if sentiment == "Positive":
                excerpt = random.choice(positive_excerpts)
            elif sentiment == "Neutral":
                excerpt = random.choice(neutral_excerpts)
            else:
                excerpt = random.choice(negative_excerpts)

        camp_id = random.choice(df_campaigns["campaign_id"].tolist()) if random.random() < 0.35 else None

        mentions_list.append({
            "mention_id": m_id,
            "platform": plat,
            "mention_date": m_date.strftime("%Y-%m-%d"),
            "topic": topic,
            "sentiment": sentiment,
            "text_excerpt": excerpt,
            "campaign_id": camp_id,
        })
    df_sentiment = pd.DataFrame(mentions_list)

    # 7. INTENTIONALLY IMPERFECT DATASET (For Data Quality Engine Demo)
    df_imperfect_sales = df_sales.copy()
    # Add 250 exact duplicates (10% duplication)
    duplicates = df_imperfect_sales.sample(250, random_state=42)
    df_imperfect_sales = pd.concat([df_imperfect_sales, duplicates], ignore_index=True)
    # Inject 400 null customer IDs & product IDs (16% nulls in key identifiers)
    null_cust_idx = df_imperfect_sales.sample(250, random_state=42).index
    df_imperfect_sales.loc[null_cust_idx, "customer_id"] = None
    null_prod_idx = df_imperfect_sales.sample(150, random_state=43).index
    df_imperfect_sales.loc[null_prod_idx, "product_id"] = None
    # Inject 50 extreme outlier revenues ($999,999.00)
    outlier_indices = df_imperfect_sales.sample(50, random_state=42).index
    df_imperfect_sales.loc[outlier_indices, "revenue"] = 999999.0
    # Inject 150 malformed / corrupted dates
    malformed_indices = df_imperfect_sales.sample(150, random_state=42).index
    df_imperfect_sales.loc[malformed_indices, "order_date"] = "1900-00-00"

    datasets = {
        "sales": df_sales,
        "customers": df_customers,
        "products": df_products,
        "campaigns": df_campaigns,
        "social_posts": df_social_posts,
        "social_sentiment": df_sentiment,
        "imperfect_sales": df_imperfect_sales,
    }

    # Save to disk in data/demo
    demo_clean_dir = settings.DEMO_DATA_DIR / "clean"
    demo_imperfect_dir = settings.DEMO_DATA_DIR / "imperfect"
    os.makedirs(demo_clean_dir, exist_ok=True)
    os.makedirs(demo_imperfect_dir, exist_ok=True)

    for name, df in datasets.items():
        target_dir = demo_imperfect_dir if name == "imperfect_sales" else demo_clean_dir
        csv_path = target_dir / f"{name}.csv"
        parquet_path = target_dir / f"{name}.parquet"
        df.to_csv(csv_path, index=False)
        df.to_parquet(parquet_path, index=False)
        logger.info(f"Saved {name} dataset ({len(df)} rows) -> {csv_path.name}")

    return datasets

if __name__ == "__main__":
    generate_nexusmart_data()
