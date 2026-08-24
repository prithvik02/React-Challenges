import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ChallengeList from './components/ChallengeList'
import CounterView from './components/CounterView'
import UsersList from './components/UsersList'
import PostsList from './components/PostsList'
import AddPostForm from './components/AddPostForm'
import PostsWithFilters from './components/PostsWithFilters'
import PostDetail from './components/PostDetail'

const CHALLENGE_SLUGS: Record<number, string> = {
  1: 'store-setup',
  2: 'first-slice',
  3: 'reading-dispatching',
  4: 'multiple-slices',
  5: 'async-thunks',
  6: 'rtk-query-setup',
  7: 'queries',
  8: 'caching-refetch',
  9: 'mutations',
  10: 'optimistic-updates',
  11: 'api-local-state',
  12: 'error-loading-ux',
  13: 'query-parameters',
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>Redux & RTK Query</h1>
          <p>Complete the challenges in sequence.</p>

          <nav style={{ marginTop: '1rem' }}>
            <Link
              to="/"
              style={{ margin: '0 0.5rem', color: 'inherit' }}
            >
              Home
            </Link>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => (
              <Link
                key={n}
                to={`/challenge/${String(n).padStart(2, '0')}-${CHALLENGE_SLUGS[n]}`}
                style={{ margin: '0 0.5rem', color: 'inherit' }}
              >
                Ch{n}
              </Link>
            ))}
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={<ChallengeList />}
            />

            <Route
              path="/challenge/01-store-setup"
              element={
                <div
                  id="challenge-01"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 01: Store Setup</h2>
                  <p>
                    Ensure store and Provider are set up per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/02-first-slice"
              element={
                <div
                  id="challenge-02"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 02: First Slice</h2>
                  <p>
                    Create counter slice per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/03-reading-dispatching"
              element={
                <div
                  id="challenge-03"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 03: Reading and Dispatching</h2>
                  <CounterView />
                </div>
              }
            />

            <Route
              path="/challenge/04-multiple-slices"
              element={
                <div
                  id="challenge-04"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 04: Multiple Slices</h2>
                  <p>
                    Add ui slice per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/05-async-thunks"
              element={
                <div
                  id="challenge-05"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 05: Async Thunks</h2>
                  <p>
                    Create usersSlice with createAsyncThunk per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/06-rtk-query-setup"
              element={
                <div
                  id="challenge-06"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 06: RTK Query Setup</h2>
                  <p>
                    Create API slice and add to store per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/07-queries"
              element={
                <div style={{ padding: '2rem' }}>
                  <h2>Challenge 07: Queries</h2>
                  <UsersList />
                </div>
              }
            />

            <Route
              path="/challenge/08-caching-refetch"
              element={
                <div
                  id="challenge-08"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 08: Caching and Cache Tags</h2>
                  <PostsList />
                </div>
              }
            />

            <Route
              path="/challenge/09-mutations"
              element={
                <div style={{ padding: '2rem' }}>
                  <h2>Challenge 09: Mutations</h2>
                  <AddPostForm />
                </div>
              }
            />

            <Route
              path="/challenge/10-optimistic-updates"
              element={
                <div
                  id="challenge-10"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 10: Optimistic Updates</h2>
                  <p>
                    Implement optimistic update in API slice per README.
                  </p>
                </div>
              }
            />

            <Route
              path="/challenge/11-api-local-state"
              element={
                <div style={{ padding: '2rem' }}>
                  <h2>Challenge 11: API and Local State</h2>
                  <PostsWithFilters />
                </div>
              }
            />

            <Route
              path="/challenge/12-error-loading-ux"
              element={
                <div style={{ padding: '2rem' }}>
                  <h2>Challenge 12: Error and Loading UX</h2>
                  <UsersList />
                </div>
              }
            />

            <Route
              path="/challenge/13-query-parameters"
              element={
                <div
                  id="challenge-13"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 13: Query with Parameters</h2>
                  <PostDetail />
                </div>
              }
            />

            <Route
              path="/challenge/13-query-parameters/:postId"
              element={
                <div
                  id="challenge-13"
                  style={{ padding: '2rem' }}
                >
                  <h2>Challenge 13: Query with Parameters</h2>
                  <PostDetail />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App