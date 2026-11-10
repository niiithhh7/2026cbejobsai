import './About.css';

const PHOTOS = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80'
];

export default function About() {
  return (
    <div className="container section">
      <div className="about-collage">
        {PHOTOS.map((src, i) => <img key={i} src={src} alt="" />)}
      </div>

      <div className="about-stats">
        <div><strong>1K+</strong><span>Active Users Every Day</span></div>
        <div><strong>200+</strong><span>Jobs Open Across Coimbatore</span></div>
        <div><strong>100+</strong><span>Career Success Stories</span></div>
      </div>

      <h2 className="section-title">About Coimbatorejobs.in</h2>
      <p>
        Coimbatorejobs.in connects job seekers with employers across the Coimbatore region, spanning industries
        such as Textiles, Engineering, Manufacturing, IT, ITES, Education, Healthcare, and Startups. We work
        closely with hiring hubs like TIDEL Park, Peelamedu, Ganapathy, Singanallur, and Avinashi Road to bring
        the most relevant local opportunities to our users, while giving employers direct access to skilled
        talent in the city. Our platform combines simple search and filtering tools with an AI-powered resume
        analyzer, so candidates can apply with confidence and employers can hire faster.
      </p>
    </div>
  );
}
