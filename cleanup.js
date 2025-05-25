import fs from 'fs';
import path from 'path';

const configPath = '/app/dist/config.json';
let minutes = 1440; // Default every 24 hours

try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    minutes = parseInt(config.DEMAF_FILE_RETENTION, 10) || minutes;
} catch (error) {
    console.error('Error reading or parsing config.json:', error);
}

const age_ms = minutes * 60 * 1000;
const now = Date.now();

function isOlder(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return now - stats.mtimeMs > age_ms;
    } catch (error) {
        console.error(`Error checking file age for ${filePath}:`, error);
        return false;
    }
}

function cleanupDirectories(dirPath, filter = () => true) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    fs.readdirSync(dirPath).forEach(entry => {
        const fullPath = path.join(dirPath, entry);

        try {
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory() && isOlder(fullPath) && filter(entry)) {
                fs.rmSync(fullPath, { recursive: true, force: true });
                console.log(`Removed directory and its contents: ${fullPath}`);
            }
        } catch (err) {
            console.error(`Error removing directory ${fullPath}:`, err);
        }
    });
}

function cleanupFiles(dirPath, filter = () => true) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    fs.readdirSync(dirPath).forEach(entry => {
        const fullPath = path.join(dirPath, entry);

        if (isOlder(fullPath) && filter(entry)) {
            try {
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Removed file: ${fullPath}`);
                }
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log(`File ${fullPath} not found.`);
                } else {
                    console.error(`Error removing file ${fullPath}:`, err);
                }
            }
        }
    });
}

cleanupDirectories('/usr/share/uploads');
cleanupDirectories('/var/repository/servicetemplates/ust.tad.servicetemplates');

['artifacttypes', 'nodetypes'].forEach(dir => {
    const dirPath = path.join('/var/repository', dir);
    cleanupDirectories(dirPath, name => !name.startsWith('tosca.'));
});

cleanupFiles('/usr/share/tadms', name => name.endsWith('.yaml'));
cleanupFiles('/var/repository/graphviz', name => name.endsWith('.dot'));
