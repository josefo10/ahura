import { Schema } from 'mongoose';

// Subesquemas para los objetos anidados
const AvailabilitySchema = new Schema(
  {
    accessibility: { type: Boolean, required: true },
    location: { type: String, required: true },
  },
  { _id: false },
);

const ClassificationLevelSchema = new Schema(
  {
    level: { type: String, enum: ['alta', 'media', 'baja'], required: true },
  },
  { _id: false },
);

const HowIsItStoredSchema = new Schema(
  {
    pecetKnowledge: { type: String, required: false },
    centralicedRepositories: { type: String, required: false },
  },
  { _id: false },
);

const LegalRegulationsSchema = new Schema(
  {
    copyright: { type: String },
    patents: { type: String },
    tradeSecrests: { type: String },
    industrialDesigns: { type: String },
    brands: { type: String },
    industrialIntellectualProperty: { type: String },
  },
  { _id: false },
);

// Schema principal del Asset
export const AssetSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  publishDate: { type: Date, required: true },
  knowledgeType: {
    type: String,
    enum: ['explícito', 'tácito'],
    required: true,
  },
  description: { type: String, required: false },
  image: { type: String, required: false },
  activeKnowledgeType: { type: String, required: false }, // puedes agregar enum si quieres restringir
  format: { type: String, required: false }, // puedes agregar enum si quieres restringir
  fileUri: { type: String, required: false },
  relatedIds: { type: [String], required: false },
  keywords: { type: [String], required: false },
  origin: {
    type: String,
    enum: ['investigación', 'experiencia', 'desarrollo', 'otros'],
    required: false,
  },
  availability: { type: AvailabilitySchema, required: false },
  classificationLevel: { type: ClassificationLevelSchema, required: false },
  howIsItStored: { type: HowIsItStoredSchema, required: false },
  ownerId: { type: String, required: true },
  responsibleOwner: { type: String, required: true },
  confidentiality: { type: Boolean, required: false },
  criticality: {
    type: String,
    enum: ['leve', 'moderado', 'grave'],
    required: false,
  },
  LegalRegulations: { type: LegalRegulationsSchema, required: false },
  status: {
    type: String,
    enum: ['en curso', 'finalizado', 'suspendido'],
    required: false,
  },
  createAt: { type: Date, required: true },
  updateAt: { type: Date, required: true },
});
