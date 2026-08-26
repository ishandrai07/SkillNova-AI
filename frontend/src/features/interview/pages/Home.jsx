import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFileName, setSelectedFileName ] = useState("")
    const [ error, setError ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFileName(file.name)
        } else {
            setSelectedFileName("")
        }
    }

    const handleGenerateReport = async () => {

        setError("");

        const resumeFile =
            resumeInputRef.current?.files?.[0] || null;

        if (!jobDescription.trim()) {
            alert("Please enter the job description.");
            return;
        }

        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload a resume or provide a self description.");
            return;
        }

        if (resumeFile && resumeFile.type !== "application/pdf") {
            alert("Please upload a PDF resume.");
            return;
        }

        const { data, error: reportError } = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile,
        });

        if (reportError) {
            setError(reportError);
            return;
        }

        navigate(`/interview/${data._id}`);
    };

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loading-box'>
                    <svg className='spinner' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/></svg>
                    <h1>Generating Strategy Plan...</h1>
                </div>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Top Navbar */}
            <nav className='app-navbar'>
                <span className='app-navbar__brand'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    SkillNova
                </span>
                <div className='app-navbar__right'>
                    {user && <span className='app-navbar__username'>{user.username}</span>}
                    <button
                        id='logout-btn'
                        className='logout-btn'
                        onClick={handleLogout}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Technical <span className='highlight'>Interview Intelligence</span></h1>
                <p>Submit job specifications and your candidate profile to generate a targeted technical interview roadmap.</p>
            </header>

            {error && (
                <div className='error-banner'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </div>
            )}

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the target job description...\ne.g., 'Senior Frontend Engineer: proficiency in React, TypeScript, and distributed web architecture...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Candidate Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Resume Document
                                <span className='badge badge--best'>Recommended</span>
                            </label>
                            <label className={`dropzone ${selectedFileName ? 'dropzone--has-file' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </span>
                                {selectedFileName ? (
                                    <>
                                        <p className='dropzone__title dropzone__title--file'>{selectedFileName}</p>
                                        <p className='dropzone__subtitle'>PDF attached • Click to replace</p>
                                    </>
                                ) : (
                                    <>
                                        <p className='dropzone__title'>Upload PDF Resume</p>
                                        <p className='dropzone__subtitle'>PDF format (Max 5MB)</p>
                                    </>
                                )}
                                <input ref={resumeInputRef} onChange={handleFileChange} hidden type='file' id='resume' name='resume' accept='.pdf' />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR PROVIDE SUMMARY</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Experience Overview</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Summarize your tech stack, years of experience, and primary engineering domains..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </span>
                            <p>Provide either a <strong>Resume</strong> or <strong>Experience Overview</strong> to construct your strategy plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>Analysis Engine v2.4 &bull; Avg runtime ~30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn button primary-button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Generate Strategy Plan
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>Recent Strategy Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className='report-item__top'>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <span className={`match-badge ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                        {report.matchScore}% Match
                                    </span>
                                </div>
                                <p className='report-meta'>Created on {new Date(report.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Documentation</a>
            </footer>
        </div>
    )
}

export default Home