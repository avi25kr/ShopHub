from pymongo import MongoClient
from config import Config  # Import your existing config

def populate_products():
    """Populate MongoDB with sample products"""
    
    sample_products = [
        {
            "_id": "p101",
            "name": "iPhone 14",
            "brand": "Apple",
            "category": "smartphone",
            "description": "Powerful A15 Bionic chip, 6.1-inch Super Retina display",
            "price": 799,
            "img": "https://images.unsplash.com/photo-1668184162572-4d21d85d8026?q=80&w=700&auto=format&fit=crop"
        },
        {
            "_id": "p102",
            "name": "MacBook Pro 14",
            "brand": "Apple",
            "category": "laptop",
            "description": "M2 Pro chip, 14-inch Liquid Retina XDR display",
            "price": 1999,
            "img": "https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p103",
            "name": "Samsung Galaxy S23",
            "brand": "Samsung",
            "category": "smartphone",
            "description": "Snapdragon 8 Gen 2, 6.1-inch Dynamic AMOLED display",
            "price": 699,
            "img": "https://images.unsplash.com/photo-1709744722656-9b850470293f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p104",
            "name": "AirPods Pro",
            "brand": "Apple",
            "category": "headphones",
            "description": "Active Noise Cancellation, Spatial Audio",
            "price": 249,
            "img": "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p105",
            "name": "Dell XPS 13",
            "brand": "Dell",
            "category": "laptop",
            "description": "Intel Core i7, 13.4-inch InfinityEdge display",
            "price": 1299,
            "img": "https://images.unsplash.com/photo-1720556405438-d67f0f9ecd44?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p106",
            "name": "Sony WH-1000XM4",
            "brand": "Sony",
            "category": "headphones",
            "description": "Industry-leading noise canceling, 30-hour battery life",
            "price": 349,
            "img": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p107",
            "name": "iPad Air",
            "brand": "Apple",
            "category": "tablet",
            "description": "M1 chip, 10.9-inch Liquid Retina display",
            "price": 599,
            "img": "https://images.unsplash.com/photo-1630331528526-7d04c6eb463f?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p108",
            "name": "Samsung Galaxy Tab S8",
            "brand": "Samsung",
            "category": "tablet",
            "description": "Snapdragon 8 Gen 1, 11-inch LTPS TFT display",
            "price": 699,
            "img": "https://plus.unsplash.com/premium_photo-1680734656959-d7dd4039bcea?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "_id": "p109",
            "name": "HP Spectre x360",
            "brand": "HP",
            "category": "laptop",
            "description": "Intel Core i7, 13.5-inch OLED touchscreen",
            "price": 1499,
            "img": "https://images.pexels.com/photos/11129922/pexels-photo-11129922.jpeg"
        },
        {
            "_id": "p110",
            "name": "Google Pixel 7",
            "brand": "Google",
            "category": "smartphone",
            "description": "Google Tensor G2, 6.3-inch OLED display",
            "price": 599,
            "img": "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/g/x/9/-original-imaggsudg5fufyte.jpeg?q=90&crop=false"
        },
        {
            "_id": "p111",
            "name": "Nintendo Switch OLED",
            "brand": "Nintendo",
            "category": "gaming",
            "description": "7-inch OLED screen, enhanced audio",
            "price": 349,
            "img": "https://images.unsplash.com/photo-1680007966627-d49ae18dbbae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmludGVuZG8lMjBzd2l0Y2glMjBvbGVkfGVufDB8fDB8fHww"
        },
        {
            "_id": "p112",
            "name": "Apple Watch Series 8",
            "brand": "Apple",
            "category": "smartwatch",
            "description": "Advanced health sensors, Always-On Retina display",
            "price": 399,
            "img": "https://rukminim2.flixcart.com/image/704/844/xif0q/smartwatch/d/f/u/-original-imaghxgsr7zzqygg.jpeg?q=90&crop=false"
        },

        # New products added
        {
            "_id": "p113",
            "name": "Canon EOS R5",
            "brand": "Canon",
            "category": "camera",
            "description": "45MP full-frame sensor, 8K video recording",
            "price": 3899,
            "img": "https://m.media-amazon.com/images/I/61vm45CsUHL._UF1000,1000_QL80_.jpg"
        },
        {
            "_id": "p114",
            "name": "PlayStation 5",
            "brand": "Sony",
            "category": "gaming",
            "description": "Ultra-fast SSD, 4K gaming with ray tracing",
            "price": 499,
            "img": "https://m.media-amazon.com/images/I/51ljnEaW0pL._UF894,1000_QL80_.jpg"
        },
        {
            "_id": "p115",
            "name": "GoPro HERO10",
            "brand": "GoPro",
            "category": "camera",
            "description": "5.3K60 video, HyperSmooth 4.0 stabilization",
            "price": 399,
            "img": "https://rukminim2.flixcart.com/image/704/844/kuyf8nk0/sports-action-camera/p/e/z/black-waterproof-action-camera-with-front-lcd-and-touch-rear-original-imag7yg4haansvzn.jpeg?q=90&crop=false"
        },
        {
            "_id": "p116",
            "name": "Logitech MX Master 3",
            "brand": "Logitech",
            "category": "accessory",
            "description": "Advanced ergonomic mouse with MagSpeed scrolling",
            "price": 99,
            "img": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=700&auto=format&fit=crop"
        },
        {
            "_id": "p117",
            "name": "Kindle Paperwhite",
            "brand": "Amazon",
            "category": "tablet",
            "description": "6.8-inch glare-free display, adjustable warm light",
            "price": 149,
            "img": "https://m.media-amazon.com/images/I/61d5WVS49ML._UF894,1000_QL80_.jpg"
        },
        {
            "_id": "p118",
            "name": "Beats Studio3",
            "brand": "Beats",
            "category": "headphones",
            "description": "Pure Adaptive Noise Cancelling, 22-hour battery life",
            "price": 349,
            "img": "https://m.media-amazon.com/images/I/618aVzbPMjL._UF1000,1000_QL80_.jpg"
        },
        {
            "_id": "p119",
            "name": "Surface Pro 9",
            "brand": "Microsoft",
            "category": "laptop",
            "description": "13-inch PixelSense touchscreen, Intel Evo platform",
            "price": 1299,
            "img": "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=700&auto=format&fit=crop"
        },
        {
            "_id": "p120",
            "name": "Bose QuietComfort 45",
            "brand": "Bose",
            "category": "headphones",
            "description": "World-class noise cancellation, 24-hour battery life",
            "price": 329,
            "img": "https://m.media-amazon.com/images/I/51HHABMPoVL._UF1000,1000_QL80_.jpg"
        }
    ]

    
    try:
        print("🔗 Connecting to MongoDB...")
        
        # Use your existing config
        client = MongoClient(Config.MONGODB_URI)
        db = client["ecommerce"]
        products_collection = db["products"]
        
        print("✅ Connected to MongoDB successfully!")
        
        # Check existing products
        existing_count = products_collection.count_documents({})
        print(f"📊 Existing products in database: {existing_count}")
        
        # Insert products
        print("📦 Inserting sample products...")
        
        inserted_count = 0
        skipped_count = 0
        
        for product in sample_products:
            try:
                products_collection.insert_one(product)
                inserted_count += 1
                print(f"  ✅ Inserted: {product['name']}")
            except Exception as e:
                if "duplicate key" in str(e).lower():
                    skipped_count += 1
                    print(f"  ⚠️  Skipped (already exists): {product['name']}")
                else:
                    print(f"  ❌ Error inserting {product['name']}: {str(e)}")
        
        print(f"\n📈 Summary:")
        print(f"  • Inserted: {inserted_count} products")
        print(f"  • Skipped: {skipped_count} products")
        
        # Final count
        total_count = products_collection.count_documents({})
        print(f"📊 Total products in database: {total_count}")
        
        # Show sample products
        print(f"\n📋 Sample products in database:")
        sample_docs = list(products_collection.find({}).limit(5))
        for i, doc in enumerate(sample_docs, 1):
            print(f"  {i}. {doc['name']} by {doc['brand']} - ${doc['price']}")
        
        client.close()
        print("\n✨ Products populated successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        
        if "connection" in str(e).lower():
            print("\n🔧 Connection troubleshooting:")
            print("1. Check your MongoDB connection string in config.py")
            print("2. Ensure your MongoDB server is running")
            print("3. Check your internet connection (if using MongoDB Atlas)")
            print("4. Verify your MongoDB credentials")

if __name__ == "__main__":
    print("🚀 Starting product population script...")
    populate_products()