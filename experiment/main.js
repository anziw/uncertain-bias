PennController.ResetPrefix(null)
DebugOff() 
SetCounter("group", "inc", 1);
newVar("failed-A-1").global().set(0)
newVar("failed-slider-1").global().set(0)
newVar("failed-A-2").global().set(0)
newVar("failed-slider-2").global().set(0)

// Sequence of the experiment
Sequence("consent", "counter", "instruction-start",
         "instruction-gumball", 
         "instruction-A-1", "check-A-1",
         "instruction-slider-1", "check-slider-1",
         "practice-start", "practice", "practice-end",
         "trials-gumball", "intermission",
         "instruction-unk-election",
         "instruction-A-2", "check-A-2",
         "instruction-slider-2", "check-slider-2",
         "trials-unk-election", "trials-end",
         "demographics",
         "send", "completion")
         
// Consent form
newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .inputWarning("Please enter your Prolific ID.")
        .print()
        .log()
    ,
    newButton("continue", "Click here to continue")
        .center()
        .print()
        .wait(
            getHtml("consent_form").test.complete()
                .failure(getHtml("consent_form").warn())
        )
)

// Instruction start
newTrial("instruction-start",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "Welcome!")
    ,
    newText("i2", "In this experiment, you will be presented with images and be asked to answer questions about each image.")
    ,
    newText("i3", "For each of A’s questions, you will also be presented with three possible responses.")
    ,
    newText("i4", "Your task is to decide how much you prefer each of the three utterances as a response to A’s questions. ")
    ,
    newText("br", "")
    ,
    newButton("wait", "Click to start")
        .center()
        .print()
        .wait()
)

// Gumball explanation
newTrial("instruction-gumball",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "In this part of the experiment, you will be presented with images of gumball machines.")
    ,
    newText("i2", "The gumball machines are filled with purple and orange gumballs. The gumballs will be tossed around before a random one is dispensed. Here is an example of what a gumball machine may look like.")
    ,
    newImage("example", "gumball_example.png")
        .center()
        .size(200, 200)
        .print()
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)


// A explanation (Block 1)
newTrial("instruction-A-1",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    getVar("failed-A-1")
        .test.is(1)
            .success(
                newText("retry-1", "It seems like you misunderstood something...")
                ,
                newText("retry-2", "<b>Please read the instructions again before returning to the experiment.</b>")
                ,
                newText("br", "")
                )
    ,
    newText("i1", "In this experiment, you will also see a fictional person “A”.")
    ,
    newText("i2", "The fictional person “A”, <b>who cannot see the images</b>, will ask you questions about the images.")
    ,
    newText("i3", "Here is an example of what A may look like.")
    ,
    newImage("example", "A_gumball_example.png")
        .center()
        .size(400, 225)
        .print()
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)


// // Check whether participants perceive A as L0 (block 1)
newTrial("check-A-1",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newImage("check", "A_gumball_example.png")
        .center()
        .size(400, 225)
        .print()
    ,
    newText("question", "In the image above, is A able to see the content on the screen?")
    ,
    newButton("go-back", "Yes")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .callback(
            getVar("failed-A-1").set(1),
            jump("instruction-A-1"), end()
        )
        .log()
    ,
    newButton("proceed", "No")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .wait()
        .log()
)

// Instructions for slider (block 1)
newTrial("instruction-slider-1",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    getVar("failed-slider-1")
        .test.is(1)
            .success(
                newText("retry-1", "It seems like you misunderstood something...")
                ,
                newText("retry-2", "<b>Please read the instructions again before returning to the experiment.</b>")
                ,
                newText("br", "")
                )
    ,
    newText("i1", "In the experiment, you will be presented with three possible responses for each of A’s questions.")
    ,
    newText("i2", "For each response, you will use a slider to indicate your degree of preference for the response. Each slider will start at the far left, which indicates zero preference. If you would never use an utterance to answer A’s question, leave its slider at the far left. If you would always pick an utterance over the other two utterances, move its slider to the far right and leave the other two sliders in their original positions. If all the sliders are set to the same position, it means you are equally likely to pick any of the utterances to answer A’s question.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// Check sliders understanding (block 1)
newTrial("check-slider-1",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newImage("left", "sliders_left.png")
        .size(200, 200)
    ,
    newImage("mid", "sliders_mid.png")
        .size(200, 200)
    ,
    newText("question", "Do the slider positions in the two images reflect the same relative preference among the three responses?")
    ,
    newCanvas("sliders", 400, 200)
        .center()
        .add(0, 0, getImage("left"))
        .add(200, 0, getImage("mid"))
        .print()
    ,
    newButton("go-back", "No")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .callback(
            getVar("failed-slider-1").set(1),
            jump("instruction-slider-1"), end()
        )
    ,
    newButton("proceed", "Yes")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .wait()
        .log()
)

// Practice start
newTrial("practice-start",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "You have finished all the instructions.")
    ,
    newText("i2", "Let us try out a few practice trials. Please click the button below to start the practice.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)


// Practice trials
Template("practices_gumball.csv", row =>
    newTrial("practice",
        defaultText
            .cssContainer({"margin-bottom":"1em"})
            .center()
            .print()
        ,
        newText("context", row.context)
        ,
        ( row.type=="experimental-trial" ? [
                newImage("image", row.image)
                    .center()
                    .size(600, 350)
                    .print()
                    .log()
                ,
                newText("question", row.question)
                ,
                newScale("slider-1", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-2", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-3", 101)
                    .slider()
                    .default(0)
                ,
                newCanvas("sliders", 500, 120)
                    .center()
                    .add(0, 10, newText("probably", row.probably))
                    .add(0, 40, newText("might", row.might))
                    .add(0, 70, newText("bare", row.bare))
                    .add(300, 10, getScale("slider-1"))
                    .add(300, 40, getScale("slider-2"))
                    .add(300, 70, getScale("slider-3"))
                    .print()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getScale("slider-1")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-2")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-3")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
                ,
                getScale("slider-1").log()
                ,
                getScale("slider-2").log()
                ,
                getScale("slider-3").log()
            ] : [
                newImage("correct", row.correct)
                    .size(400, 225)
                ,
                newImage("incorrect", row.incorrect)
                    .size(400, 225)
                ,
                newCanvas("side-by-side", 800, 250)
                    .add(0, 0, getImage("correct"))
                    .add(400, 0, getImage("incorrect"))
                    .center()
                    .print()
                ,
                newSelector("selection")
                    .add(getImage("correct"), getImage("incorrect"))
                    .shuffle()
                    .log()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getSelector("selection")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
            ] )
    )
    .log("id", row.id)
    .log("group", row.group)
)

// End of practice instruction page
newTrial("practice-end",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "You have finished the practice.")
    ,
    newText("i2", "Please click the button below to start the experiment.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// Block 1: gumball trials
Template("lists_gumball.csv", row =>
    newTrial("trials-gumball",
        defaultText
            .cssContainer({"margin-bottom":"1em"})
            .center()
            .print()
        ,
        newText("context", row.context)
        ,
        ( row.type=="experimental-trial" ? [
                newImage("image", row.image)
                    .center()
                    .size(600, 350)
                    .print()
                    .log()
                ,
                newText("question", row.question)
                ,
                newScale("slider-1", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-2", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-3", 101)
                    .slider()
                    .default(0)
                ,
                newCanvas("sliders", 500, 120)
                    .center()
                    .add(0, 10, newText("probably", row.probably))
                    .add(0, 40, newText("might", row.might))
                    .add(0, 70, newText("bare", row.bare))
                    .add(300, 10, getScale("slider-1"))
                    .add(300, 40, getScale("slider-2"))
                    .add(300, 70, getScale("slider-3"))
                    .print()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getScale("slider-1")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-2")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-3")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
                ,
                getScale("slider-1").log()
                ,
                getScale("slider-2").log()
                ,
                getScale("slider-3").log()
            ] : [
                newImage("correct", row.correct)
                    .size(400, 225)
                ,
                newImage("incorrect", row.incorrect)
                    .size(400, 225)
                ,
                newCanvas("side-by-side", 800, 250)
                    .add(0, 0, getImage("correct"))
                    .add(400, 0, getImage("incorrect"))
                    .center()
                    .print()
                ,
                newSelector("selection")
                    .add(getImage("correct"), getImage("incorrect"))
                    .shuffle()
                    .log()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getSelector("selection")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
            ] )
    )
    .log("id", row.id)
    .log("group", row.group)
)

// Block 1 end
newTrial("intermission",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "You have finished the first half of the experiment.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// instructions for unk election
newTrial("instruction-unk-election",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("i1", "In this part of the experiment, you will be presented with images of election predictions from an unknown country.")
    ,
    newText("i2", "In this country, the two major parties, Party X and Party Y, compete for votes in different counties. In each county, the party with the maximum votes wins that county.")
    ,
    newText("i3", "A bipartisan company is interested in studying the probability of the two parties winning in different parts of the country – specifically they are interested in comparing the results in different counties. So they generate predictions about the outcomes of the elections county by county. This company has a great track record of generating very reliable predictions. Here is an example of what a prediction may look like.")
    ,
    newImage("example", "unk_election_example.png")
        .center()
        .size(200, 200)
        .print()
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// A explanation (Block 2)
newTrial("instruction-A-2",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    getVar("failed-A-2")
        .test.is(1)
            .success(
                newText("retry-1", "It seems like you misunderstood something...")
                ,
                newText("retry-2", "<b>Please read the instructions again before returning to the experiment.</b>")
                ,
                newText("br", "")
                )
    ,
    newText("i1", "In this experiment, you will also see a fictional person “A”.")
    ,
    newText("i2", "The fictional person “A”, <b>who cannot see the images</b>, will ask you questions about the images.")
    ,
    newText("i3", "Here is an example of what A may look like.")
    ,
    newImage("example", "A_unk_election_example.png")
        .center()
        .size(400, 225)
        .print()
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// Check A understanding (block 2)
newTrial("check-A-2",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newImage("check", "A_unk_election_example.png")
        .center()
        .size(400, 225)
        .print()
    ,
    newText("question", "In the image above, is A able to see the content on the screen?")
    ,
    newButton("go-back", "Yes")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .callback(
            getVar("failed-A-2").set(1),
            jump("instruction-A-2"), end()
        )
        .log()
    ,
    newButton("proceed", "No")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .wait()
        .log()
)

// Instructions for slider (block 2)
newTrial("instruction-slider-2",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    getVar("failed-slider-2")
        .test.is(1)
            .success(
                newText("retry-1", "It seems like you misunderstood something...")
                ,
                newText("retry-2", "<b>Please read the instructions again before returning to the experiment.</b>")
                ,
                newText("br", "")
                )
    ,
    newText("i1", "In the experiment, you will be presented with three possible responses for each of A’s questions.")
    ,
    newText("i2", "For each response, you will use a slider to indicate your degree of preference for the response. Each slider will start at the far left, which indicates zero preference. If you would never use an utterance to answer A’s question, leave its slider at the far left. If you would always pick an utterance over the other two utterances, move its slider to the far right and leave the other two sliders in their original positions. If all the sliders are set to the same position, it means you are equally likely to pick any of the utterances to answer A’s question.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// Check sliders understanding (block 2)
newTrial("check-slider-2",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newImage("left", "sliders_left.png")
        .size(200, 200)
    ,
    newImage("mid", "sliders_mid.png")
        .size(200, 200)
    ,
    newText("question", "Do the slider positions in the two images reflect the same relative preference among the three responses?")
    ,
    newCanvas("sliders", 400, 200)
        .center()
        .add(0, 0, getImage("left"))
        .add(200, 0, getImage("mid"))
        .print()
    ,
    newButton("go-back", "No")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .callback(
            getVar("failed-slider-2").set(1),
            jump("instruction-slider-2"), end()
        )
    ,
    newButton("proceed", "Yes")
        .center()
        .cssContainer({"margin-bottom":"1em"})
        .print()
        .wait()
        .log()
)


// Block 2: unk election trials
Template("lists_unk_election.csv", row =>
    newTrial("trials-unk-election",
        defaultText
            .cssContainer({"margin-bottom":"1em"})
            .center()
            .print()
        ,
        newText("context", row.context)
        ,
        ( row.type=="experimental-trial" ? [
                newImage("image", row.image)
                    .center()
                    .size(600, 350)
                    .print()
                    .log()
                ,
                newText("question", row.question)
                ,
                newScale("slider-1", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-2", 101)
                    .slider()
                    .default(0)
                ,
                newScale("slider-3", 101)
                    .slider()
                    .default(0)
                ,
                newCanvas("sliders", 500, 120)
                    .center()
                    .add(0, 10, newText("probably", row.probably))
                    .add(0, 40, newText("might", row.might))
                    .add(0, 70, newText("bare", row.bare))
                    .add(300, 10, getScale("slider-1"))
                    .add(300, 40, getScale("slider-2"))
                    .add(300, 70, getScale("slider-3"))
                    .print()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getScale("slider-1")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-2")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getScale("slider-3")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
                ,
                getScale("slider-1").log()
                ,
                getScale("slider-2").log()
                ,
                getScale("slider-3").log()
            ] : [
                newImage("correct", row.correct)
                    .size(400, 225)
                ,
                newImage("incorrect", row.incorrect)
                    .size(400, 225)
                ,
                newCanvas("side-by-side", 800, 250)
                    .add(0, 0, getImage("correct"))
                    .add(400, 0, getImage("incorrect"))
                    .center()
                    .print()
                ,
                newSelector("selection")
                    .add(getImage("correct"), getImage("incorrect"))
                    .shuffle()
                    .log()
                ,
                newButton("wait", "Click to continue")
                    .center()
                    .print()
                    .disable()
                ,
                getSelector("selection")
                    .callback(
                        getButton("wait").enable()
                    )
                ,
                getButton("wait").wait()
            ] )
    )
    .log("id", row.id)
    .log("group", row.group)
)

// End of experimental trials instruction page
newTrial("trials-end",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("intruction-1", "Almost there!")
    ,
    newText("intruction-2", "Please fill out the demographic survey on the next page. Please answer <b>all</b> of the questions on the survey. ")
    ,
    newText("instruction-3", "Remember, no one other than the researchers will be able to link your data or responses to the demographic survey to your Prolific ID. Before making any of this data publicly available, we will replace your Prolific ID with a random ID.")
    ,
    newButton("wait", "Click to proceed")
        .center()
        .print()
        .wait()
)

// Demographic survey
newTrial("demographics",
    newHtml("demographics_survey", "demographics.html")
        .cssContainer({"width":"720px"})
        .inputWarning("You haven't completed the survey yet. ")
        .radioWarning("You haven't completed the survey yet. ")
        .print()
        .log()
    ,
    newButton("continue", "Click here to continue")
        .center()
        .print()
        .wait(
            getHtml("demographics_survey").test.complete()
                .failure(getHtml("demographics_survey").warn())
        )
)

SendResults("send")

newTrial("completion",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("thanks", "Thank you for participating! Your submission on Prolific will be approved within 5 business days.")
    ,
    newText("code", "Please save your completion code: <b>C1M2WBNY</b>")
    ,
    newText("exit", "You may exit the window now.")
    ,
    newButton("void", "")
        .wait()
)
