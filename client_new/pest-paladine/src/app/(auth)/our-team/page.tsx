"use client";

import Image from "next/image";

export default function OurTeam() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-primary mb-6">Meet Our Team</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center">
        We are a dedicated group of innovators, working together to protect your space with AI-powered pest detection.
      </p>

      {/* Team Picture */}
      <div className="mt-10 w-full max-w-4xl flex justify-center">
        <Image
          src="/team-photo.jpg" // Replace this with the actual team image path
          alt="Our Team"
          width={800}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Thank You Note & Team Members */}
      <div className="mt-8 text-center max-w-2xl">
        <p className="text-lg font-semibold">With Gratitude</p>
        <p className="text-lg text-muted-foreground">
          A heartfelt thank you to{" "}
          <strong className="text-black">Professor Oleg Michailovich</strong> for his invaluable guidance and expertise as our project consultant.
          His support has been instrumental in shaping our vision and success.
        </p>

        <div className="border-t mt-4 pt-4">
          <p className="text-lg font-semibold">Our Team Members</p>
          <p className="text-lg text-muted-foreground">
            Brian Wu, Jony Liu, Andrew Liu, Jordan Feng
          </p>
        </div>
      </div>
    </div>
  );
}
