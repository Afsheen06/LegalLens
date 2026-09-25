export default function FeatureCards() {
    const features = [
        { title: 'Document Analysis', description: 'Extract key clauses, parties, and governing law automatically.' },
        { title: 'Contract Comparison', description: 'Highlight variances between standard templates and third-party paper.' },
        { title: 'Ask AI', description: 'Query the document for specific obligations or terms.' },
        { title: 'Important Clause Detection', description: 'Flags indemnities, limitations of liability, and termination clauses.' }
    ];

    return (
        <div style={{ padding: '5rem 3rem', borderTop: '1px solid var(--border)', backgroundColor: '#fff' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '3rem', fontFamily: 'var(--heading)' }}>Platform Capabilities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px' }}>
                {features.map((f, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        padding: '2rem 0',
                        borderBottom: '1px solid var(--border)',
                        alignItems: 'center'
                    }}>
                        <div style={{ width: '48px', height: '48px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '2rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontSize: '1.2rem' }}>§</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontFamily: 'var(--sans)', fontWeight: '600' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{f.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
