
const competitions = [
    {
        name: "Win a Trip to Cape Town",
        category: "Travel",
        start_date: "2025-03-01",
        end_date: "2025-03-31",
        description: "Enter to win a luxurious trip for two to Cape Town!"
    },
    {
        name: "Tech Gadget Giveaway",
        category: "Technology",
        start_date: "2025-03-15",
        end_date: "2025-04-15",
        description: "Win the latest smartphone by entering this exciting giveaway."
    },
    {
        name: "Fitness Challenge",
        category: "Health & Welness",
        start_date: "2025-02-15",
        end_date: "2025-03-20",
        description: "Participate in the challenge to win exclusive gym memberships."
    },
    
];

let currentCompetition = null;

$( function () {
  
    // Event Listeners
    $('#enterCompetitionBtn').click(confirmEntry);
    $(document).on('click', '#confirmEntryBtn', handleEntryConfirmation);
    

    initializeFilters();
    displayCompetitions(getActiveCompetitions());
});

function isCompetitionActive(competition) {
    const endDate = new Date(competition.end_date);
    const now = new Date();
    return endDate > now;
}

function getActiveCompetitions() {
    return competitions.filter(isCompetitionActive);
}

function initializeFilters() {
    const categories = [...new Set(getActiveCompetitions().map(comp => comp.category))];
    
    $('#filters').empty();
    
    $.each(categories, function(index, category) {
        $('<button>')
            .addClass('category-btn')
            .text(category)
            .click(() => filterCompetitions(category))
            .appendTo('#filters');
    });
}

function displayCompetitions(comps) {
    $('.competitionsList').empty();
    
    $.each(comps, function(index, competition) {
        const startDate = new Date(competition.start_date);
        const endDate = new Date(competition.end_date);
        
        const row = $('<tr>');
        row.append($('<td>').text(competition.name));
        row.append($('<td>').text(competition.category));
        row.append($('<td>').text(
            `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`));
        row.append($('<td>').text(competition.description.substring(0, 50) + '...'));
        
        const detailBtn = $('<button>')
            .addClass('btn btn-primary btn-sm view-details-btn')
            .text('View Details')
            .click(() => showCompetitionDetails(competition));
            
        row.append($('<td>').append(detailBtn));
        
        $('.competitionsList').append(row);
    });
}

function showCompetitionDetails(competition) {
    currentCompetition = competition;
    
    const modal = $('#competitionDetailModal');
    
    modal.find('.modal-title').text(competition.name.toUpperCase());
    $('#detail-category').text(competition.category);
    $('#detail-travel').text(competition.travel);
    $('#detail-dates').text(
        `${new Date(competition.start_date).toLocaleDateString()} - ${new Date(competition.end_date).toLocaleDateString()}`
    );
    $('#detail-description').text(competition.description);
    
    modal.modal('show');
}

function confirmEntry() {
    const modal = $('#competitionDetailModal');
    const competition = currentCompetition;
    
    modal.find('.modal-body').html(`
        <div class="text-center">
            <h5>Confirm Entry</h5>
            <p>Are you sure you want to enter the "${competition.name}" competition?</p>
            <div class="mt-4">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">No</button>
                <button type="button" class="btn btn-primary" id="confirmEntryBtn">Yes, Enter Competition</button>
            </div>
        </div>
    `);
}

function handleEntryConfirmation() {
    const modal = $('.competitionDetailModal');
    const competition = currentCompetition;
    
    modal.find('.modal-body').html(`
        <div class="text-center">
            <h5>Entry Confirmed!</h5>
            <p>You have successfully entered the "${competition.name}" competition.</p>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
    `);
}

function filterCompetitions(selectedCategory) {
    $('.category-btn').removeClass('active');
    $(event.target).addClass('active');

    const activeCompetitions = getActiveCompetitions();
    const filteredCompetitions = activeCompetitions.filter(comp => 
        selectedCategory === 'All' || comp.category === selectedCategory
    );

    displayCompetitions(filteredCompetitions);
}