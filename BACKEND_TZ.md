# Backend Technical Specification (TZ) for FigmaClone

## 1. Project Overview
The backend for FigmaClone provides persistent storage, real-time collaboration, and asset management for a vector-based design tool. It supports hierarchical design elements, a component system (master/instance), and multi-user editing.

## 2. System Architecture
- **API**: RESTful API for project management and heavy operations.
- **Real-time**: WebSockets for live updates (cursors, element movements).
- **Database**: Relational database (PostgreSQL) with JSONB for flexible element properties.
- **Storage**: Object storage (S3/Minio) for uploaded images.

## 3. Data Models

### 3.1 Project
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| name | String | Project name |
| owner_id | UUID | Foreign Key to Users |
| created_at | Timestamp | Creation date |
| updated_at | Timestamp | Last modified date |

### 3.2 Element (Recursive Structure)
| Field | Type | Description |
|---|---|---|
| id | String | Client-side generated ID |
| project_id | UUID | Foreign Key to Projects |
| parent_id | String | Self-reference for nesting (nullable) |
| name | String | Element display name |
| type | Enum | rect, circle, text, image, frame, group, instance |
| x, y | Float | Position relative to parent |
| width, height | Float | Dimensions |
| properties | JSONB | Styling: fill, stroke, opacity, font, constraints, etc. |
| master_id | String | Reference to a Master Element (if type is instance) |
| z_index | Float | Ordering within parent |

### 3.3 Master (Component Definitions)
| Field | Type | Description |
|---|---|---|
| id | String | Unique Identifier |
| project_id | UUID | Foreign Key to Projects |
| name | String | Component name |
| data | JSONB | Full Element definition |

## 4. API Endpoints

### 4.1 Project Management
- `GET /api/projects`: List user projects.
- `POST /api/projects`: Create new project.
- `GET /api/projects/:id`: Get project details and all elements.
- `PATCH /api/projects/:id`: Update project metadata.
- `DELETE /api/projects/:id`: Delete project.

### 4.2 Assets
- `POST /api/projects/:id/assets`: Upload design assets (images). Returns URL.

### 4.3 Element Sync (Optimized for Bulk)
- `POST /api/projects/:id/elements/sync`: Batch upsert/delete elements to reduce network overhead.

## 5. Real-time Collaboration (WebSockets)
The backend must broadcast changes to all connected clients in a project room:
- `CURSOR_MOVE`: { userId, x, y }
- `ELEMENT_UPDATE`: { id, patch: Partial<Element> }
- `ELEMENT_CREATE`: { element }
- `ELEMENT_DELETE`: { ids: string[] }

## 6. Technical Stack Recommendations
- **Runtime**: Node.js (TypeScript)
- **Framework**: NestJS or Express
- **Database**: PostgreSQL (with JSONB support)
- **Real-time**: Socket.io
- **Auth**: Clerk or Auth0 for identity management.

---

# Prompt Version (AI Generation Ready)

**System Prompt:**
"You are a Senior Backend Engineer. Your task is to design and implement a scalable backend for a Figma clone based on the provided design element structures."

**Project Prompt:**
"Create a Node.js/TypeScript backend for a design tool. 
1. **Database Schema**: Use PostgreSQL with Prisma. Define `Project`, `User`, `Element`, and `Master` entities. The `Element` entity must support a tree structure using `parentId` and store visual properties in a JSONB field.
2. **Element Properties**: Match this structure:
   - Types: 'circle', 'frame', 'group', 'image', 'instance', 'rect', 'text'.
   - Properties: fill (string/gradient), stroke, constraints (horizontal/vertical), font settings, image source/fit.
3. **Real-time**: Integrate Socket.io. Implement 'Project Rooms' where users broadcast their cursor positions and design changes (deltas) to others.
4. **API**: 
   - `GET /projects/:id` should return the project with a flattened or nested list of elements.
   - `POST /projects/:id/sync` should handle batch updates of multiple elements to minimize database transactions.
5. **Logic**: Implement the 'Instance' logic where an element of type 'instance' inherits or overrides properties from a `Master` element."
