"use client";

export function LocationMap() {
    return (
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3372.632997787332!2d77.1868356151703!3d32.24318718112229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390487081633b43b%3A0x1b1f8a83ceada25!2sMorni Hills%2C%20Haryana%20Pradesh!5e0!3m2!1sen!2sin!4v1626876618774!5m2!1sen!2sin!4v1626876618774!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Resort Location"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
}
