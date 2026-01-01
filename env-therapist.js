#!/usr/bin/env node

// ENV Variable Therapist - Because your environment needs a safe space
// Let's unpack those feelings, one variable at a time

const fs = require('fs');
const path = require('path');

// The three stages of ENV grief: missing, malformed, and "it works on my machine"
const stages = {
    MISSING: '😱 MISSING',
    MALFORMED: '🤔 MALFORMED',
    CONFLICT: '⚡ CONFLICT',
    OK: '✅ OK'
};

class EnvTherapist {
    constructor() {
        this.diagnoses = [];
        this.envFiles = ['.env', '.env.local', '.env.staging', '.env.production'];
    }

    // Listen without judgment (mostly)
    listen() {
        console.log('\n🧠 ENV THERAPIST SESSION STARTING...\n');
        console.log('Let\'s talk about how that makes you feel...\n');
        
        this.checkCurrentEnv();
        this.compareEnvFiles();
        this.giveDiagnosis();
    }

    // Check what's currently in your emotional state (process.env)
    checkCurrentEnv() {
        const required = ['PORT', 'DATABASE_URL', 'API_KEY'];
        
        required.forEach(key => {
            const value = process.env[key];
            if (!value) {
                this.diagnoses.push({ key, stage: stages.MISSING, note: 'Have you tried setting it?' });
            } else if (value.length < 3) {
                this.diagnoses.push({ key, stage: stages.MALFORMED, note: 'That seems... short' });
            } else {
                this.diagnoses.push({ key, stage: stages.OK, note: 'Good job! You\'re valid!' });
            }
        });
    }

    // Compare your different personalities (env files)
    compareEnvFiles() {
        const envValues = {};
        
        this.envFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n');
                
                lines.forEach(line => {
                    if (line.includes('=')) {
                        const [key, value] = line.split('=');
                        if (key && value) {
                            if (!envValues[key]) envValues[key] = {};
                            envValues[key][file] = value;
                        }
                    }
                });
            }
        });

        // Find identity crises (conflicting values)
        Object.entries(envValues).forEach(([key, files]) => {
            const uniqueValues = new Set(Object.values(files));
            if (uniqueValues.size > 1) {
                this.diagnoses.push({ 
                    key, 
                    stage: stages.CONFLICT, 
                    note: `Can\'t decide between ${Array.from(uniqueValues).join(' and ')}` 
                });
            }
        });
    }

    // The breakthrough moment
    giveDiagnosis() {
        console.log('📋 DIAGNOSIS REPORT:\n');
        
        this.diagnoses.forEach(d => {
            console.log(`${d.stage} ${d.key}: ${d.note}`);
        });
        
        const issues = this.diagnoses.filter(d => d.stage !== stages.OK).length;
        console.log(`\n💊 PRESCRIPTION: ${issues} issue(s) found. Have you tried turning it off and on again?`);
        console.log('\n🏆 Remember: Your environment is valid and deserves love!\n');
    }
}

// Time for your session
if (require.main === module) {
    const therapist = new EnvTherapist();
    therapist.listen();
}

module.exports = EnvTherapist;