import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('backend', 'competitions.json');

async function readData() {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

export const getCompetitions = async (req, res) => {
  try {
    const competitions = await readData();
    const { category } = req.query;
    const now = new Date();

    let filtered = competitions.filter(c => new Date(c.end_date) > now);
    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompetitionById = async (req, res) => {
  try {
    const competitions = await readData();
    const competition = competitions.find(c => c.id === parseInt(req.params.id));
    if (!competition) return res.status(404).json({ message: 'Competition not found' });
    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCompetition = async (req, res) => {
  try {
    const competitions = await readData();
    const newComp = { id: Date.now(), ...req.body };
    competitions.push(newComp);
    await writeData(competitions);
    res.status(201).json(newComp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCompetition = async (req, res) => {
  try {
    const competitions = await readData();
    const index = competitions.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Competition not found' });

    competitions[index] = { ...competitions[index], ...req.body };
    await writeData(competitions);
    res.json(competitions[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCompetition = async (req, res) => {
  try {
    let competitions = await readData();
    const index = competitions.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Competition not found' });

    const deleted = competitions.splice(index, 1);
    await writeData(competitions);
    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
