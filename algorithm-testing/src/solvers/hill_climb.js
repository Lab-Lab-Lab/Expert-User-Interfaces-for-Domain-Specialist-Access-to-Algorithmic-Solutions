/**
 * Implements the hill climbing optimization algorithm.
 */
class HillClimb {
    /**
     * Creates an instance of HillClimb.
     * 
     * @param {Object} init_state - The initial state.
     * @param {number} iterations - The number of iterations to perform.
     * @param {function(Object): Object} neighbor - A function that generates a random neighboring solution.
     * @param {function(Object): number} score - A function that calculates the score of a solution.
     */
    constructor(init_state, iterations, neighbor, score) {
        this.init_state = init_state;
        this.iterations = iterations;
        this.neighbor = neighbor;
        this.score = score;
        this.best_solution = init_state;
        this.best_score = score(init_state);
    }

    /**
     * Performs the hill climbing optimization algorithm.
     * 
     * @returns {Object} The best solution found.
     */
    optimize() {
        let cur_solution = this.init_state;
        let cur_score = this.score(this.init_state);

        for (let i = 0; i < this.iterations; i++) {
            const new_solution = this.neighbor(cur_solution);
            const new_score = this.score(new_solution);

            if (new_score > cur_score) {
                cur_solution = new_solution;
                cur_score = new_score;
            }

            if (cur_score > this.best_score) {
                this.best_solution = cur_solution;
                this.best_score = cur_score;
            }
        }

        return this.best_solution;
    }
}

module.exports = HillClimb;
